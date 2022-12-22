

namespace mmria_pmss_server
{
    class Message
            {
                public string Text { get;set; }
            }
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            var app = builder.Build();

            var provider = new Microsoft.AspNetCore.StaticFiles.FileExtensionContentTypeProvider();
            // Add new mappings
            provider.Mappings[".dll"] = "application/octet-stream";
            provider.Mappings[".blat"] = "application/octet-stream";
            provider.Mappings[".dat"] = "application/octet-stream";
            provider.Mappings[".css"] = "text/css";


            /*if(app.Environment.IsDevelopment())
            {
                var static_content_location = Path.Combine
                            (
                                Directory.GetCurrentDirectory().Replace("mmria-pmss-server","mmria-pmss-client"),
                            "bin",
                            "Release",
                            "netstandard2.1",
                            "browser-wasm",
                            "publish",
                            "wwwroot"
                            );

                app.UseStaticFiles
                (
                    
                    new StaticFileOptions
                {
                    
                        FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider
                        (
                            static_content_location
                            //Path.Combine("..", "mmria-pmss-client","wwwroot")
                        ),
                        RequestPath = "",
                        ContentTypeProvider = provider
                    }
                );
            }
            else
            {*/
                app.UseStaticFiles();
            //}



            

            //app.MapGet("/", () => "Hello World!");

            app.MapGet("/", (HttpRequest request, HttpResponse response) =>
                    {
                        response.WriteAsync(System.IO.File.ReadAllText($"{static_content_location}/index.html"));
                        
                    });
            app.MapGet("/hello", () => Results.Ok(new Message() {  Text = "Hello World!" }))
                .Produces<Message>();
            app.Run("http://localhost:5000");
        }

    }

}