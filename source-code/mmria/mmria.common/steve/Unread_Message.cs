namespace mmria.common.steve;
public class Unread_Message
{
    public Unread_Message(){}

    public string messageId {get;set;}
    public string fileName {get;set;}
    public string status {get;set;}
}

public class UnreadMessageResult
{
    public UnreadMessageResult() {}
    public Unread_Message[] unreadMessages {get;set;}
    public int? maxCount {get;set;}
    public string mailboxId {get;set;}
    public bool? success {get;set;}
    public string message {get;set;}
}