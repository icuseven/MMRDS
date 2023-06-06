function render(messages)
{
    var result = [];
    var message_one = messages[0];
    var message_two = messages[1];
    result.push
    (
        `
        <form id="message-one-form">
            <h2>Message 1 (${message_one.publish_status == 0 ? 'Unpublished' : 'Published'})</h2>
            <p>Title (Limit 250 characters)</p>
            <input type=text id=message-one-title maxlength="250" />
            <p>Detail Content (Limit 2000 characters)</p>
            <textarea id="message-one-body" rows=10 cols=80 maxlength="2000"></textarea>
            <fieldset>
                <legend>Type</legend>
                <div>
                    <label for="message-one-information">
                        <input type="radio" id="message-one-information" name="message-one-type" value="information" aria-label="Information"> Information
                    </label>
                </div>
                <div>
                    <label for="message-one-warning">
                        <input type="radio" id="message-one-warning" name="message-one-type" value="information" aria-label="Information"> Warning
                    </label>
                </div>
                <div>
                    <label for="message-one-error">
                        <input type="radio" id="message-one-error" name="message-one-type" value="information" aria-label="Error"> Error
                    </label>
                </div>
            </fieldset>
            ${createTypePreviewHTML(message_one)}
            <div>
                <input class="btn btn-primary" type="button" value="Save Draft" onclick="saveDraft('${message_one.id}')" />
                <input class="btn btn-primary" type="button" value="Publish Latest Draft" onclick="publishLatestDraft("${message_one.id}")" />
                <input class="btn btn-primary" type="button" value="Unpublish Message" onclick="unpublishMessage("${message_one.id}")" />
                <input class="btn btn-cancel" type="button" value="Reset" onclick="reset("${message_one.id}")" />
            </div>
        </form>
        `
    );

    result.push( `
        <form id="message-two-form">
            <h2>Message 2 (${message_two.publish_status == 0 ? 'Unpublished' : 'Published'})</h2>
            <p>Title (Limit 250 characters)</p>
            <input type=text id=message-two-title maxlength="250" />
            <p>Detail Content (Limit 2000 characters)</p>
            <textarea id="message-two-body" rows=10 cols=80 maxlength="2000"></textarea>
            <fieldset>
                <legend>Type</legend>
                <div>
                    <label for="message-two-information">
                        <input type="radio" id="message-two-information" name="message-two-type" value="information" aria-label="Information"> Information
                    </label>
                </div>
                <div>
                    <label for="message-two-warning">
                        <input type="radio" id="message-two-warning" name="message-two-type" value="information" aria-label="Information"> Warning
                    </label>
                </div>
                <div>
                    <label for="message-two-error">
                        <input type="radio" id="message-two-error" name="message-two-type" value="information" aria-label="Error"> Error
                    </label>
                </div>
            </fieldset>
            ${createTypePreviewHTML(message_two)}
            <div>
                <input class="btn btn-primary" type="button" value="Save Draft" onclick="saveDraft("${message_two.id}")" />
                <input class="btn btn-primary" type="button" value="Publish Latest Draft" onclick="publishLatestDraft("${message_two.id}")" />
                <input class="btn btn-primary" type="button" value="Unpublish Message" onclick="unpublishMessage("${message_two.id}")" />
                <input class="btn btn-cancel" type="button" value="Reset" onclick="reset("${message_two.id}")" />
            </div>
        </form>
    `
    );   
    
    return result;
}

function createTypePreviewHTML(message){
    var draftPreviewHTML = ``;
    var publishedPreviewHTML = ``;
    draftPreviewHTML = `
        <p>Draft Preview</p>
        <div id="${message.id}draft">
            <div class="alert alert-danger col-md-12" id="alert_unique_16262b641c316a">
            <div class="row d-flex padding-pagealert align-items-center">
                <div class="flex-grow-0 col">
                    <span class="fi cdc-icon-alert_06 " aria-hidden="true"></span>                        
                </div>
                <div class="col">
                    <p id="${message.id}title-draft" class="margin-pagealert">
                    ${message.draft.title}
                    </p>		
                </div>
                ${message.draft.body.length > 0 ? `<div class="col flex-grow-0"><input class="btn btn-primary" type="button" value="Details" /></div>` : ``}
            </div>
        </div>
    `;
    if(message.publish_status == 0){
        publishedPreviewHTML = `
            <p>Published Version</p>
            <i>No message published.</i>
        `;
    } else {
        publishedPreviewHTML = `
            <p>Published Version</p>
            <div id="${message.id}draft">
                <div class="alert alert-danger col-md-12" id="alert_unique_16262b641c316a">
                <div class="row d-flex padding-pagealert align-items-center">
                    <div class="flex-grow-0 col">
                        <span class="fi cdc-icon-alert_06 " aria-hidden="true"></span>                        
                    </div>
                    <div class="col">
                        <p id="${message.id}title-draft" class="margin-pagealert">
                        ${message.published.title}
                        </p>		
                    </div>
                    ${message.published.body.length > 0 ? `<div class="col flex-grow-0"><input class="btn btn-primary" type="button" value="Details" /></div>` : ``}
                </div>
            </div>
        `;
    }
    return draftPreviewHTML + publishedPreviewHTML;
}