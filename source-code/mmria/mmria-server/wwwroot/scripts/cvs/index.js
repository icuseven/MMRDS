const bc = new BroadcastChannel('cvs_channel');
bc.onmessage = (message_data) => {

    g_filter = message_data.data.g_filter;

    g_view_or_print = message_data.data.view_or_print;

    g_report_type = message_data.data.reportType;
    g_report_index = message_data.data.report_index;

    pre_render(message_data.data);
}