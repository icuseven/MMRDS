const bc = new BroadcastChannel('alligator_channel');
bc.onmessage = (eventMessage) => {
  console.log(eventMessage);
}