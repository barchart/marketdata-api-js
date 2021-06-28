# @barchart/marketdata-api-js/scripts/replay

A simple Node.js script which accepts WebSocket connections, mimics a Barchart market data server, and replays a stream of previously captured market data events from a text file.

### Usage Guide

#### Capture Market Data

Use the [`capture.js`](./../capture/README.md) script to capture a live market data feed. Then, move the output file to the `logs` folder of this script.

#### Start Replay Server

Start the replay server, as follows:

```shell
node replay.js
```

#### Connections

Once started, the server should accept WebSocket connections on port 8080.

#### Commands

Once a WebSocket connection is established, commands can be issued. Most DDF commands are ignored, excepting the `GO _TIMESTAMP_` command.

Here is a list of the replay-related commands that are supported:

* `LOAD {file}` — Loads a file (from the `logs` directory). The server will not respond to this command.
* `NEXT` — Assuming the load command was accepted, the server will echo the next line in the replay file.
* `SCROLL {index}` — Assuming the load command was accepted, several line(s) in the replay will be echoed (up to the specified index).

### Usage Examples

#### Command Line (using WSCAT)

You can connect to the replay server with the [wscat](https://github.com/websockets/wscat#readme) command line tool, as follows:

```shell
wscat -c ws://localhost:8080/jerq
```

Once connected, issue commands via the terminal. Here is an example

```text
 % wscat -c ws://localhost:8080/jerq
 
Connected (press CTRL+C to quit)
< +++
< + success

> LOAD ZCN1.ddf
> NEXT
< %<CV symbol="ZCN1" basecode="2" tickincrement="2" last="6534" lastsize="45" lastcvol="55" date="20210624000000" count="54" data="6516,430:6514,239:6512,199:6510,164:6506,31:6520,528:6522,659:6524,767:6526,724:6530,1425:6532,1503:6534,2152:6536,2171:6556,2471:6554,2776:6552,3304:6550,3901:6546,2425:6544,2242:6542,1875:6540,2101:6560,2574:6562,1904:6564,2198:6566,2041:6570,2725:6572,2198:6574,1349:6576,1177:6584,1212:6586,1205:6590,1358:6592,805:6594,539:6596,443:6582,750:6580,1400:6622,303:6620,165:6616,256:6614,251:6612,398:6610,317:6636,1:6634,18:6632,40:6630,79:6626,118:6624,87:6600,532:6602,437:6604,525:6606,257:6640,110"/>

> SCROLL 5
< %<QUOTE symbol="ZCN1" name="Corn" exchange="CBOT" basecode="2" pointvalue="50.0" tickincrement="2" ddfexchange="B" flag="s" lastupdate="20210624161053" mode="R"><SESSION day="N" session=" " timestamp="20210624160206" open="6640" high="6640" low="6506" last="6532" previous="6642" settlement="6532" tradesize="45" openinterest="160881" volume="118774" numtrades="27934" pricevolume="36105648.75" tradetime="20210624131959" ticks=".." id="combined"/><SESSION day="M" timestamp="20210623000000" last="6642" previous="6596" settlement="6642" openinterest="160881" volume="127090" ticks=".." id="previous"/><SESSION day="N" session="T" timestamp="20210624151742" previous="6642" id="session_N_T"/></QUOTE>
< 2ZCN1,02B106640,50NGUFXPiM
< 2ZCN1,02B106506,60NGUFXPiM
< 2ZCN1,02B106532,d0N UFXPiM
```

#### Example Page

The example page will connect to the replay server, as follows:

1. Load the [example page](./../example/browser/README.html) in a web browser.
2. Enter `localhost` in the _Server_ field (two new text boxes will appear).
3. Enter the name of the file to replay (which should be located in the `logs` directory).
4. Enter a comma-delimited list of symbols to monitor (market data messages for these symbols should be contained in the replay file).
5. Click the "Connect" button.
6. Use the buttons in the header to issue _NEXT_ and _SCROLL_ commands.
7. As the replay server sends market data messages, they are processed by the SDK, causing the UI should update accordingly.
