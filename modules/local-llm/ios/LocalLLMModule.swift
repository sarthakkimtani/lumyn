import ExpoModulesCore
import FoundationModels

public class LocalLLMModule: Module {
    private var sessions: [String: Any] = [:]
    private var sessionTranscripts: [String: ModelTranscript] = [:]
    private var systemPrompt: String = ""

    public func definition() -> ModuleDefinition {
        Name("LocalLLM")

        Function("checkAvailability") { () -> LocalModelAvailability in
            return getModelAvailability()
        }

        Function("setSystemPrompt") { (prompt: String) in
            setSystemPrompt(prompt)
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
            availability.available = .incorrectIOSVersion
            return availability
        }

        let systemModel = SystemLanguageModel.default

        switch systemModel.availability {
        case .available:
            availability.available = .available
        case .unavailable(.deviceNotEligible):
            availability.available = .deviceNotEligible
        case .unavailable(.appleIntelligenceNotEnabled):
            availability.available = .appleIntelligenceNotEnabled
        case .unavailable(.modelNotReady):
            availability.available = .modelNotReady
        case .unavailable:
            availability.available = .unavailable
        }

        return availability
    }

    private func setSystemPrompt(_ prompt: String) {
        systemPrompt = prompt.trimmingCharacters(in: .whitespacesAndNewlines)
    }

    private func transcriptForSession(sessionId: String) -> ModelTranscript {
        if let transcript = sessionTranscripts[sessionId] {
            return transcript
        }

        let fallbackTranscript =
            LocalLLMTranscriptHelper.defaultModelTranscript(
                systemPrompt: systemPrompt
            )
        sessionTranscripts[sessionId] = fallbackTranscript
        return fallbackTranscript
    }

    private func storeTranscript(
        _ transcript: ModelTranscript,
        for sessionId: String
    ) {
        sessionTranscripts[sessionId] = transcript
    }

    private func appendTranscriptEntry(
        _ entry: TranscriptEntry,
        to sessionId: String
    ) {
        let transcript = transcriptForSession(sessionId: sessionId)
        transcript.entries.append(entry)
        storeTranscript(transcript, for: sessionId)
    }

    private func createSession(request: LocalSessionRequest)
        -> LocalSessionDetails
    {
        let sessionDetails = LocalSessionDetails()
        let baseTranscript =
            request.transcript
            ?? LocalLLMTranscriptHelper.defaultModelTranscript(
                systemPrompt: systemPrompt
            )
        let transcriptRecord = LocalLLMTranscriptHelper.ensureInstructionsEntry(
            in: baseTranscript,
            systemPrompt: systemPrompt
        )
        let sessionId = UUID().uuidString
        sessionDetails.id = sessionId
        storeTranscript(transcriptRecord, for: sessionId)

        guard #available(iOS 26.0, *) else {
            return sessionDetails
        }

        let languageSession = LocalLLMTranscriptHelper.createLanguageSession(
            transcriptRecord: transcriptRecord,
            systemPrompt: systemPrompt
        )
        sessions[sessionId] = languageSession

        return sessionDetails
    }

    private func getTranscript(sessionId: String) -> ModelTranscript {
        return transcriptForSession(sessionId: sessionId)
    }

    private func streamText(sessionId: String, prompt: String) async
        -> StreamingSession
    {
        let session = StreamingSession()
        session.sessionId = sessionId

        guard #available(iOS 26.0, *) else {
            return LocalLLMStreamingHelper.makeInactiveSession(
                sessionId: sessionId,
                error: LocalLLMErrorMessage.requiresIOS26
            )
        }

        guard let languageSession = sessions[sessionId] as? LanguageModelSession
        else {
            return LocalLLMStreamingHelper.makeInactiveSession(
                sessionId: sessionId,
                error: LocalLLMErrorMessage.sessionDoesNotExist
            )
        }

        appendTranscriptEntry(
            LocalLLMTranscriptHelper.makeTranscriptEntry(
                role: .prompt,
                text: prompt
            ),
            to: sessionId
        )

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
                    let chunkEvent = LocalLLMStreamingHelper.makeChunkEvent(
                        sessionId: sessionId,
                        content: responseContent,
                        isComplete: false
                    )
                    sendEvent("onStreamingChunk", chunkEvent.toDictionary())
                }

                if !responseContent.isEmpty {
                    appendTranscriptEntry(
                        LocalLLMTranscriptHelper.makeTranscriptEntry(
                            role: .response,
                            text: responseContent
                        ),
                        to: sessionId
                    )
                }

                let completionEvent = LocalLLMStreamingHelper.makeChunkEvent(
                    sessionId: sessionId,
                    content: "",
                    isComplete: true
                )
                sendEvent("onStreamingChunk", completionEvent.toDictionary())

            } catch is CancellationError {
            } catch {
                let errorEvent = LocalLLMStreamingHelper.makeErrorEvent(
                    sessionId: sessionId,
                    error: error.localizedDescription
                )
                sendEvent("onStreamingError", errorEvent.toDictionary())
            }
        }

        return session
    }
}
