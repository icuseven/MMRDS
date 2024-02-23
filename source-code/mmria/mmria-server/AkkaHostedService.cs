using System;
using System.Threading.Tasks;
using System.Threading;
using Serilog;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;

using Akka.Actor;
using Akka.DI.Extensions.DependencyInjection;


namespace mmria.server;

public record HostedServicePrefix(string host_prefix);

public sealed class AkkaHostedService : IHostedService, IAsyncDisposable
{
    readonly Task _completedTask = Task.CompletedTask;
    string host_prefix;

    mmria.common.couchdb.ConfigurationSet DbConfigSet;
    IConfiguration configuration;
    mmria.common.couchdb.OverridableConfiguration overridable_config;
   
    public AkkaHostedService
    (
        HostedServicePrefix _host_prefix,
        mmria.common.couchdb.ConfigurationSet _DbConfigSet,
        IConfiguration _configuration,
        mmria.common.couchdb.OverridableConfiguration _overridable_config 
    ) 
    {
        DbConfigSet = _DbConfigSet;
        configuration = _configuration;
        overridable_config = _overridable_config;
        host_prefix = _host_prefix.host_prefix;
    }
 
    public Task StartAsync(CancellationToken stoppingToken)
    {
        System.Console.WriteLine("{Service} is running.", nameof(AkkaHostedService));

        return _completedTask;
    }

    private void DoWork(object? state)
    {
        int count = 0;

        System.Console.WriteLine(
            "{Service} is working, execution count: {Count:#,0}",
            nameof(AkkaHostedService),
            count);
    }

    public Task StopAsync(CancellationToken stoppingToken)
    {
        System.Console.WriteLine(
            "{Service} is stopping.", nameof(AkkaHostedService));



        return _completedTask;
    }

    public async ValueTask DisposeAsync()
    {
        /*
        if (_timer is IAsyncDisposable timer)
        {
            await timer.DisposeAsync();
        }

        _timer = null;
        */
    }

}