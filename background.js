/*
Called when the item has been created, or when creation failed due to an error.
We'll just log success/failure here.
*/
function onCreated() {
  if (browser.runtime.lastError) {
    console.log(`Error: ${browser.runtime.lastError}`);
  } else {
    console.log("Menu item for PostgreSQL archive URL created successfully");
  }
}

function launchMessage(msg) {
    messageid = msg.headers['message-id'][0];

    messageid = messageid.replace("<","").replace(">","");

    archiveurl = "https://www.postgresql.org/message-id/" + messageid

    navigator.clipboard.writeText(archiveurl).then(function() {
	console.log("PostgreSQL archive URL copied to clipboard");
    }, function() {
	console.log("could not write to clipboard");
    });

    /*
      We could open the URL like this. But then it opens in a new Thunderbird tab,
      not in the browser. That's not what I want.

    let createData = {
	url: archiveurl
    };
    let creating = browser.windows.create(createData);
    console.log("opened!");
    */
}

function messageLoadingError(error) {
    console.log("Error loading messages: " + error);
}

/*
Create the menu item
*/
browser.menus.create({
  id: "copy-archive-url",
  title: browser.i18n.getMessage("menuItemCopyArchiveUrl"),
  contexts: ["message_list"],
}, onCreated);

/*
*/
browser.menus.onClicked.addListener((info, tab) => {
  switch (info.menuItemId) {
    case "copy-archive-url":

      /* Note: msgid is Thunderbird's internal ID. Not the message's Message-Id header. */
      var msgid = info.selectedMessages.messages[0].id;
      var msg = browser.messages.getFull(msgid);
      msg.then(launchMessage, messageLoadingError);

      break;
  }

});
