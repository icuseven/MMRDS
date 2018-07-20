using System;
using System.Threading.Tasks;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;


namespace mmria.server.util
{   
    public class JurisdictionAuthorizationRequirement : IAuthorizationRequirement
    {
    }


    public class HasJurisdictionAuthorizationHandler : AuthorizationHandler<JurisdictionAuthorizationRequirement>
    {
        protected override Task HandleRequirementAsync
        (
          AuthorizationHandlerContext context, 
          JurisdictionAuthorizationRequirement requirement
        )
        {
            if (!context.User.HasClaim(c => c.Type == "JurisdictionList" && 
                                            c.Issuer == "https://contoso.com"))
            {
                return Task.CompletedTask;
            }

            context.Succeed(requirement);

            return Task.CompletedTask;
        }
    }
}