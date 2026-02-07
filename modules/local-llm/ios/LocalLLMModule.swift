import ExpoModulesCore
import FoundationModels

public class LocalLLMModule: Module {
    private var sessions: [String: Any] = [:]
    private var sessionTranscripts: [String: ModelTranscript] = [:]

    public func definition() -> ModuleDefinition {
        Name("LocalLLM")

        Function("checkAvailability") { () -> LocalModelAvailability in
            return getModelAvailability()
        }

        Function("startSession") {
            (request: LocalSessionRequest) -> LocalSessionDetails in
            return createSession(request: request)
        }

        Function("getTranscript") { (sessionId: String) -> ModelTranscript in
            return getTranscript(sessionId: sessionId)
        }

        AsyncFunction("streamText") {
            (request: StreamTextRequest) -> StreamingSession in
            return await streamText(
                sessionId: request.sessionId,
                prompt: request.prompt
            )
        }

        Events("onStreamingChunk", "onStreamingError")
    }

    private func getModelAvailability()
        -> LocalModelAvailability
    {
        let availability = LocalModelAvailability()
        
        guard #available(iOS 26.0, *) else {
            availability.isAvailable = false
            availability.reason = "Requires iOS 26.0 or later"
            return availability
        }

        let systemModel = SystemLanguageModel.default

        switch systemModel.availability {
        case .available:
            availability.isAvailable = true
        case .unavailable(.deviceNotEligible):
            availability.isAvailable = false
            availability.reason = "Device is not eligible"
        case .unavailable(.appleIntelligenceNotEnabled):
            availability.isAvailable = false
            availability.reason = "Apple Intelligence is not enabled"
        case .unavailable(.modelNotReady):
            availability.isAvailable = false
            availability.reason = "Model is not ready"
        case .unavailable:
            availability.isAvailable = false
            availability.reason = "Unknown"
        }

        return availability
    }

    private func createSession(request: LocalSessionRequest)
        -> LocalSessionDetails
    {
        let sessionDetails = LocalSessionDetails()
        var transcriptRecord = request.transcript ?? ModelTranscript()
        transcriptRecord = assignMissingTranscriptEntryIds(transcriptRecord)

        let sessionId = UUID().uuidString
        sessionDetails.id = sessionId
        sessionTranscripts[sessionId] = transcriptRecord
        
        guard #available(iOS 26.0, *) else {
            return sessionDetails
        }
        
        var entries: [FoundationModels.Transcript.Entry] = []
        for entry in transcriptRecord.entries {
            switch entry.role {
            case .prompt:
                let promptEntry = Transcript.Prompt(
                    id: entry.id,
                    segments: [.text(.init(content: entry.text))]
                )
                entries.append(.prompt(promptEntry))
            case .response:
                let responseEntry = Transcript.Response(
                    id: entry.id,
                    assetIDs: [],
                    segments: [.text(.init(content: entry.text))]
                )
                entries.append(.response(responseEntry))
            case .toolCalls:
                continue
            case .toolOutput:
                continue
            }
        }

        let transcript = Transcript(entries: entries)
        let languageSession = LanguageModelSession(transcript: transcript)
        sessions[sessionId] = languageSession

        return sessionDetails
    }

    private func getTranscript(sessionId: String) -> ModelTranscript {
        return sessionTranscripts[sessionId] ?? ModelTranscript()
    }
    
    private func assignMissingTranscriptEntryIds(_ transcript: ModelTranscript)
        -> ModelTranscript
    {
        var updatedTranscript = transcript
        for index in updatedTranscript.entries.indices {
            if updatedTranscript.entries[index].id.isEmpty {
                updatedTranscript.entries[index].id = UUID().uuidString
            }
        }
        return updatedTranscript
    }

    private func streamText(sessionId: String, prompt: String) async
        -> StreamingSession
    {
        let session = StreamingSession()
        session.sessionId = sessionId
        
        guard #available(iOS 26.0, *) else {
            session.isActive = false
            session.error = "Requires iOS 26.0 or later"
            return session
        }
        
        guard let languageSession = sessions[sessionId] as? LanguageModelSession else {
            session.isActive = false
            session.error = "Session does not exist"
            return session
        }
        
        var promptEntry = TranscriptEntry()
        promptEntry.id = UUID().uuidString
        promptEntry.role = .prompt
        promptEntry.text = prompt
        promptEntry.tool = nil
        var updatedTranscript = sessionTranscripts[sessionId] ?? ModelTranscript()
        updatedTranscript.entries.append(promptEntry)
        sessionTranscripts[sessionId] = updatedTranscript

        Task {
            do {
                let promptObj = Prompt(prompt)
                let stream = languageSession.streamResponse(to: promptObj)
                var responseContent = ""

                for try await currentContent in stream {
                    if Task.isCancelled {
                        throw CancellationError()
                    }
                    
                    responseContent = currentContent.content

                    let chunkEvent = StreamingChunkEvent()
                    chunkEvent.sessionId = sessionId
                    chunkEvent.content = currentContent.content
                    chunkEvent.isComplete = false
                    sendEvent("onStreamingChunk", chunkEvent.toDictionary())
                }

                if !responseContent.isEmpty {
                    var responseEntry = TranscriptEntry()
                    responseEntry.id = UUID().uuidString
                    responseEntry.role = .response
                    responseEntry.text = responseContent
                    responseEntry.tool = nil
                    var completionTranscript = self.sessionTranscripts[sessionId] ?? ModelTranscript()
                    completionTranscript.entries.append(responseEntry)
                    self.sessionTranscripts[sessionId] = completionTranscript
                }
                
                let completionEvent = StreamingChunkEvent()
                completionEvent.sessionId = sessionId
                completionEvent.content = ""
                completionEvent.isComplete = true
                sendEvent("onStreamingChunk", completionEvent.toDictionary())

            } catch is CancellationError {
            } catch {
                let errorEvent = StreamingErrorEvent()
                errorEvent.sessionId = sessionId
                errorEvent.error = error.localizedDescription
                sendEvent("onStreamingError", errorEvent.toDictionary())

            }
        }

        return session
    }
}
