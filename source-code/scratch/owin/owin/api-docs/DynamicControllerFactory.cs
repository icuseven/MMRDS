using System;
using System.Net.Http.Handlers;

namespace owin
{
	public class DynamicControllerFactory : DefaultHttpControllerSelector
	{
		private readonly IServiceLocator _Locator;

		public DynamicControllerFactory(IServiceLocator locator)
		{
			_Locator = locator;
		}

		protected override Type GetControllerType(string controllerName)
		{
			var controllerType = base.GetControllerType(controllerName);
			// if a controller wasn't found with a matching name, return our dynamic controller
			return controllerType ?? typeof (DynamicController);
		}

		protected override IController GetControllerInstance(Type controllerType)
		{
			var controller = base.GetControllerInstance(controllerType) as Controller;

			var actionInvoker = _Locator.GetInstance<IActionInvoker>();
			if (actionInvoker != null)
			{
				controller.ActionInvoker = actionInvoker;
			}

			return controller;
		}
	}
}

