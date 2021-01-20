using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using Akka.Actor;
using RecordsProcessor_Worker.Actors;
using RecordsProcessorApi.Actors.VitalsImport;

namespace RecordsProcessorApi
{
    public class Worker : BackgroundService
    {
        private readonly ILogger<Worker> _logger;
        private IConnection _connection;
        private IModel _channel;
        private string _queueName = "vitals_import_queue";
        private ActorSystem _actorSystem;


        public Worker(ILogger<Worker> logger, ActorSystem actorSystem)
        {
            _logger = logger;
            _actorSystem = actorSystem;
#if !DEBUG
            InitializeRabbitMqListener();
#endif
        }

        private void InitializeRabbitMqListener()
        {
            string rabbitMQHostName = Environment.GetEnvironmentVariable("RABBITMQ_HOSTNAME");

            var factory = new ConnectionFactory
            {
                HostName = rabbitMQHostName,
                //UserName = _username,
                //Password = _password
            };

            _connection = factory.CreateConnection();
            if (_connection != null)
                Console.WriteLine("Connection Alive");
            //_connection.ConnectionShutdown += RabbitMQ_ConnectionShutdown;
            _channel = _connection.CreateModel();
            if (_channel != null)
                Console.WriteLine("Channel Alive");
            _channel.QueueDeclare(queue: _queueName, durable: true, exclusive: false, autoDelete: false, arguments: null);
        }

        protected override Task ExecuteAsync(CancellationToken stoppingToken)
        {
            stoppingToken.ThrowIfCancellationRequested();
            //We have no access to the queue on local
#if !DEBUG
            var consumer = new EventingBasicConsumer(_channel);
            consumer.Received += (ch, ea) =>
            {
                var body = ea.Body.ToArray();
                var message = Encoding.UTF8.GetString(body);
                Console.WriteLine(" [x] Received {0}", message);


                //Context.ActorOf(Props.Create<Rebuild_Export_Queue>()).Tell(new_scheduleInfo);
                //_actorSystem.ActorOf(Props.Create<Process_Message>()).Tell(message);

                var processor = _actorSystem.ActorOf<Recieve_Import_Actor>();

                processor.Tell(message);

                _channel.BasicAck(ea.DeliveryTag, false);
            };
            _channel.BasicConsume(_queueName, false, consumer);
#endif

            return Task.CompletedTask;
        }
    }
}
