using System;
namespace cqrs.write
{
    public class MarkedAdAsInterestingEvent : IEvent
    {
        public int UserId { get; set; }
        public int AdId { get; set; }
    }
}
