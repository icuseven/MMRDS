using System;
namespace cqrs.write
{
    public partial class SessionController
    {
        private readonly ICommandBus _command_bus;
        public SessionController(ICommandBus p_command_bus)
        {
            _command_bus = p_command_bus;
        }

        /*
        public void MarkAsInteresting_UsingCommands(MarkAdAsInterestingCommand command)
        {
            _command_bus.Send(command);
        }


        public void MarkAsInteresting(MarkAdAsInterestingCommand command)
        {
            _command_bus.Send(command);
        }
        */

    }
}
