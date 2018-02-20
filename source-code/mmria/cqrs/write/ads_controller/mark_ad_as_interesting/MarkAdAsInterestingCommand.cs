using System;
namespace cqrs.write
{
    public class MarkAdAsInterestingCommand : ICommand
    {
        public int UserId { get; set; }
        public int AdId { get; set; }
    }
}
