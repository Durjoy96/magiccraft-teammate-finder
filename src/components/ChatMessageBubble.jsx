export default function ChatMessageBubble({ message, isOwn, senderName }) {
  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-xs lg:max-w-md xl:max-w-lg ${
          isOwn ? "order-2" : "order-1"
        }`}
      >
        {!isOwn && (
          <p className="text-xs text-gray-400 mb-1 px-3">{senderName}</p>
        )}
        <div
          className={`rounded-2xl px-4 py-2 ${
            isOwn
              ? "bg-linear-to-r from-purple-600 to-cyan-600 text-white"
              : "bg-gray-700 text-gray-100"
          }`}
        >
          <p className="text-sm">{message.content}</p>
          <p className="text-xs mt-1 opacity-70">
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
