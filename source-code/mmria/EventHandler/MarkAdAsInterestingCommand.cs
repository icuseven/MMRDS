using System;
using cqrs;

using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


// these should be in a project that doesn't reference a framework
namespace cqrs.write
{

    // the following can be published in a separate dll
    public class WhenAdMarkedAsInteresting_NotifyCompany :IEventHandler<MarkedAdAsInterestingEvent>
    {
        public void Handle(MarkedAdAsInterestingEvent @event) {}
    }

    public class WhenAdMarkedAsInteresting_TargetMoreAdsTowardsUser : IEventHandler<MarkedAdAsInterestingEvent>
    {
        public void Handle(MarkedAdAsInterestingEvent @event) { }
    }

    public class WhenAdMarkedAsInteresting_PrepareEmailCampaignForUser : IEventHandler<MarkedAdAsInterestingEvent>
    {
        public void Handle(MarkedAdAsInterestingEvent @event) { }
    }

}
