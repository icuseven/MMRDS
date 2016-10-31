using System;
using System.Web.Http;

namespace owin
{
	public class queueController: ApiController 
	{
		public queueController ()
		{
		}

		public owin.data.api.Check_Queue_Response Post(owin.data.api.Check_Queue_Request check_queue_request)
		{ 
			owin.data.api.Check_Queue_Response result = null;

			return result;
		}
	}
}

