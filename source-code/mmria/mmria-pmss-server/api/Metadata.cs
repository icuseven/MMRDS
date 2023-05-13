namespace mmria_pmss_server;


public static class MetadataEndpoint
{
    public static WebApplication AddMetadataEndpoint(this WebApplication app)
    {

        app.MapGet("/metadata/mmria-pmss-builder", (IHttpClientFactory httpClientFactory) =>
        {
             var client = httpClientFactory.CreateClient("database_client");

            //var metadata_path = "metadata/mmria-pmss-builder";
            var metadata_path = "metadata/2016-06-12T13:49:24.759Z";

            var result = client.GetFromJsonAsync<mmria.common.metadata.app>(metadata_path).GetAwaiter().GetResult();

            return Results.Ok<mmria.common.metadata.app>(result);
           
        });


        app.MapGet("/metadata/ui_specification", (IHttpClientFactory httpClientFactory) =>
        {
             var client = httpClientFactory.CreateClient("database_client");

            //var metadata_path = "metadata/mmria-pmss-builder";
            var metadata_path = "metadata/default_ui_specification";

            var result = client.GetFromJsonAsync<mmria.common.metadata.UI_Specification>(metadata_path).GetAwaiter().GetResult();

            return Results.Ok<mmria.common.metadata.UI_Specification>(result);
           
        });

        return app;
    }
}