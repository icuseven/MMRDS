using System;
namespace cqrs.write
{
    public partial class AdsController
    {
        public void MarkAsInteresting_UsingCommands(MarkAdAsInterestingCommand command)
        {
            _command_bus.Send(command);
        }
    }
}
