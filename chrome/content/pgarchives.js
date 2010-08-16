
function process(app, args, synchronous) {
	var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
	file.initWithPath(app);
	var process = Components.classes["@mozilla.org/process/util;1"].createInstance(Components.interfaces.nsIProcess);
	process.init(file);
	process.run(synchronous, args, args.length);
} 

function lookupMessageInPgArchives(emailAddressNode)
{
	messageURI = GetFirstSelectedMessage();
	if (messageURI == null) {
		alert('Could not find message');
		return;
	}

	var messageService = messenger.messageServiceFromURI(messageURI);
	var messageStream = Components.classes["@mozilla.org/network/sync-stream-listener;1"]
		.createInstance().QueryInterface(Components.interfaces.nsIInputStream);
	var inputStream = Components.classes["@mozilla.org/scriptableinputstream;1"]
		.createInstance().QueryInterface(Components.interfaces.nsIScriptableInputStream);

	inputStream.init(messageStream);
	try {
		messageService.streamMessage(messageURI,messageStream, msgWindow, null, false, null);
	} catch (ex) {
		alert('Could not stream message!');
		return;
	}

	var content = '';
	inputStream.available();
	while (inputStream.available()) {
		content = content + inputStream.read(512);

		var p = content.indexOf("\r\n\r\n");
		if (p > 0) {
			// Found end of header
			content = content.substring(0, p);
			break;
		}
	}

	var headers = Components.classes["@mozilla.org/messenger/mimeheaders;1"]
		.createInstance().QueryInterface(Components.interfaces.nsIMimeHeaders);
	headers.initialize(content, content.length);

	msgid = headers.extractHeader("Message-ID",false);

	msgid = msgid.replace("<","").replace(">","");

	process('/etc/alternatives/x-www-browser', Array('http://archives.postgresql.org/message-id/' + msgid), false);
}
