import ExpoModulesCore
import Foundation

struct LocalModelAvailability: Record {
    @Field var isAvailable: Bool = false
    @Field var reason: String? = nil
    @Field var osVersion: String =
        ProcessInfo.processInfo.operatingSystemVersionString
}

enum TranscriptEntryRole: String, Enumerable {
    case prompt
    case response
    case toolCalls
    case toolOutput
}

struct TranscriptEntry: Record {
    @Field var role: TranscriptEntryRole = .prompt
    @Field var text: String = ""
    @Field var tool: String?
}

struct ModelTranscript: Record {
    @Field var entries: [TranscriptEntry] = []
}

struct LocalSessionRequest: Record {
    @Field var transcript: ModelTranscript? = nil
}

struct LocalSessionDetails: Record {
    @Field var id: String = ""
}

struct StreamingSession: Record {
    @Field var sessionId: String = ""
    @Field var isActive: Bool = true
    @Field var error: String? = nil
}

struct StreamingChunkEvent: Record {
    @Field var sessionId: String = ""
    @Field var content: String = ""
    @Field var isComplete: Bool = false
}

struct StreamingErrorEvent: Record {
    @Field var sessionId: String = ""
    @Field var error: String = ""
}

struct StreamTextRequest: Record {
    @Field var sessionId: String = ""
    @Field var prompt: String = ""
}
