function render()
{
    const result = [];

    result.push
    (
        `
        <p>Message 1 (Published)</p>
        <p>Title (Limit 250 characters)</p>
        <input type=text id=message-one-title />

        <p>Detail Content (Limit 2000 characters)</p>
        <textarea id="message-one-detail" rows=10 cols=80>


        </textarea>

        <p>Type</p>

Error (red)


Message 1 (Published)

Published Version

This is a previously published message.

Warning (yellow)


Information (purple)


Type

Error (red)


Draft Preview


Draft Preview


Title (Limit 250 characters)

Published Version

No message published.

Publish Latest Draft

Unpublish Message

Reset
        `
    );

    return result;
}