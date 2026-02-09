import Foundation
import FoundationModels

enum LocalLLMErrorMessage {
    static let requiresIOS26 = "Requires iOS 26.0 or later"
    static let sessionDoesNotExist = "Session does not exist"
}

enum LocalLLMTranscriptHelper {
    static func makeTranscriptEntry(
        role: TranscriptEntryRole,
        text: String,
        tool: String? = nil
    ) -> TranscriptEntry {
        var entry = TranscriptEntry()
        entry.id = UUID().uuidString
        entry.role = role
        entry.text = text
        entry.tool = tool
        return entry
    }

    static func defaultModelTranscript(systemPrompt: String) -> ModelTranscript {
        var transcript = ModelTranscript()
        transcript.entries = [
            makeTranscriptEntry(role: .instructions, text: systemPrompt)
        ]
        return transcript
    }

    static func ensureInstructionsEntry(
        in transcript: ModelTranscript,
        systemPrompt: String
    ) -> ModelTranscript {
        if transcript.entries.contains(where: { $0.role == .instructions }) {
            return transcript
        }

        var updatedTranscript = transcript
        updatedTranscript.entries.insert(
            makeTranscriptEntry(role: .instructions, text: systemPrompt),
            at: 0
        )
        return updatedTranscript
    }

    @available(iOS 26.0, *)
    static func createLanguageSession(
        transcriptRecord: ModelTranscript,
        systemPrompt: String
    ) -> LanguageModelSession {
        let onlyInstructions = transcriptRecord.entries.allSatisfy {
            $0.role == .instructions
        }

        if onlyInstructions {
            let instructions = transcriptRecord.entries.first(where: {
                $0.role == .instructions
            })?.text ?? systemPrompt
            return LanguageModelSession(instructions: instructions)
        }

        let transcript = buildNativeTranscript(from: transcriptRecord)
        return LanguageModelSession(transcript: transcript)
    }

    @available(iOS 26.0, *)
    static func buildNativeTranscript(from transcriptRecord: ModelTranscript)
        -> Transcript
    {
        var entries: [FoundationModels.Transcript.Entry] = []
        for entry in transcriptRecord.entries {
            switch entry.role {
            case .instructions:
                let instructionsEntry = Transcript.Instructions(
                    id: entry.id,
                    segments: [.text(.init(content: entry.text))],
                    toolDefinitions: []
                )
                entries.append(.instructions(instructionsEntry))
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

        return Transcript(entries: entries)
    }
}

enum LocalLLMStreamingHelper {
    static func makeInactiveSession(sessionId: String, error: String)
        -> StreamingSession
    {
        let session = StreamingSession()
        session.sessionId = sessionId
        session.isActive = false
        session.error = error
        return session
    }

    static func makeChunkEvent(
        sessionId: String,
        content: String,
        isComplete: Bool
    ) -> StreamingChunkEvent {
        let chunkEvent = StreamingChunkEvent()
        chunkEvent.sessionId = sessionId
        chunkEvent.content = content
        chunkEvent.isComplete = isComplete
        return chunkEvent
    }

    static func makeErrorEvent(sessionId: String, error: String)
        -> StreamingErrorEvent
    {
        let errorEvent = StreamingErrorEvent()
        errorEvent.sessionId = sessionId
        errorEvent.error = error
        return errorEvent
    }
}
