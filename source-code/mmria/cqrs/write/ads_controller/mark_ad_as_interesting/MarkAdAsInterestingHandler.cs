using System;
namespace cqrs.write
{
    public class MarkAdAsInterestingHandler : ICommandHandler<MarkAdAsInterestingCommand>
    {
        private readonly dynamic _simpleData;
        private readonly EventBus _eventBus;

        public MarkAdAsInterestingHandler(dynamic simpleData, EventBus eventBus)
        {
            _simpleData = simpleData;
            _eventBus = eventBus;
        }

        public void Handle(MarkAdAsInterestingCommand command)
        {
            _simpleData.InterestingAds.Insert(
                UserId: command.UserId, AdvertisementId: command.AdId
            );

            _eventBus.Publish(new MarkedAdAsInterestingEvent
            {
                UserId = command.UserId,
                AdId = command.AdId
            });
        }
    }
}
