const dgram = require("dgram");

const UDP_PORT = 7000;

const udpServer = dgram.createSocket("udp4");

let deviceState = {
  aktywnosc: 0,
  uwzglednijOpady: 0,
  trybPracy: 2,
  customDateTime: null,
  sekcje: [0, 0, 0, 0, 0, 0, 0, 0],
  grupy: [0, 0, 0, 0, 0, 0, 0, 0],
  irrigationActive: false,
  irrigationStartTime: null,
  ustawienia: [
    [0, 1, 1, -1, 22, 0, 22, 20, 20],
    [1, 2, 1, -1, 22, 25, 22, 45, 20],
    [2, 3, 1, -1, 22, 50, 23, 10, 20],
    [3, 4, 1, -1, 23, 14, 23, 59, 45],
    [4, 5, 1, -1, 1, 0, 1, 20, 20],
    [5, 2, 1, -1, 1, 25, 1, 45, 20],
    [6, 3, 1, -1, 1, 50, 2, 10, 20],
    [7, 4, 1, -1, 2, 15, 3, 15, 60],
    [8, -1, -1, -1, -1, -1, -1, -1, -1],
    [9, -1, -1, -1, -1, -1, -1, -1, -1],
    [10, -1, -1, -1, -1, -1, -1, -1, -1],
    [11, -1, -1, -1, -1, -1, -1, -1, -1],
    [12, -1, -1, -1, -1, -1, -1, -1, -1],
    [13, -1, -1, -1, -1, -1, -1, -1, -1],
    [14, -1, -1, -1, -1, -1, -1, -1, -1],
    [15, -1, -1, -1, -1, -1, -1, -1, -1],
  ],
  grupySekcji: [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 1, 0, 0, 0, 0, 1, 0, 0],
    [2, 0, 0, 1, 1, 0, 0, 0, 0, 0],
    [3, 0, 0, 0, 0, 1, 1, 0, 0, 0],
    [4, 0, 0, 0, 0, 0, 0, 0, 1, 1],
    [5, 0, 0, 0, 0, 1, 0, 1, 0, 0],
    [6, 0, 0, 0, 0, 0, 1, 1, 0, 0],
    [7, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [8, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ],
};

function getCurrentDateTime() {
  const now = deviceState.customDateTime
    ? new Date(deviceState.customDateTime)
    : new Date();
  const date = now.toISOString().split("T")[0];
  const time = now.toTimeString().split(" ")[0];

  const days = ["nie", "pon", "wto", "sro", "czw", "pia", "sob"];
  const dayName = days[now.getDay()];

  return { date, time, dayName };
}

function generateFrame() {
  const { date, time, dayName } = getCurrentDateTime();

  const frameData = [
    "wachcio_nawodnienie_v3",
    deviceState.aktywnosc.toString(),
    deviceState.uwzglednijOpady.toString(),
    deviceState.trybPracy.toString(),
    date,
    time,
    dayName,
    "2",
    "14.0",
    "8,0",
    deviceState.sekcje.join(","),
    "8,0",
    deviceState.grupy.join(","),
    "16",
  ];

  deviceState.ustawienia.forEach((ust) => {
    frameData.push(ust.join(","));
  });

  deviceState.grupySekcji.forEach((grupa) => {
    frameData.push(grupa.join(","));
  });

  frameData.push("1.2.0", "8", "02.06.2020", "15:44:20");

  // Last two values: if irrigation is active, show time and date, otherwise spaces
  if (deviceState.irrigationActive && deviceState.irrigationStartTime) {
    const irrigationDate = new Date(deviceState.irrigationStartTime);
    const timeStr = irrigationDate.toTimeString().split(" ")[0];
    const dateStr = irrigationDate.toISOString().split("T")[0];
    frameData.push(timeStr, dateStr);
  } else {
    frameData.push(" ", " ");
  }

  return frameData.join(",") + ";";
}

function turn_off_irrigation() {
  deviceState.grupy = [0, 0, 0, 0, 0, 0, 0, 0];
  deviceState.sekcje = [0, 0, 0, 0, 0, 0, 0, 0];
  deviceState.irrigationActive = false;
  deviceState.irrigationStartTime = null;
}

function handleCommand(command, clientInfo) {
  const cmd = command.trim();

  // Ignore our own broadcast frames
  if (cmd.startsWith("wachcio_nawodnienie_v3")) {
    return null;
  }

  console.log(
    `Received command: ${cmd} from ${clientInfo.address}:${clientInfo.port}`
  );

  if (cmd === "AT+TESTP") {
    return "OK";
  }

  if (cmd.startsWith("AT+AKTYWNOSC=")) {
    const value = parseInt(cmd.split("=")[1]);
    if (value === 0 || value === 1) {
      deviceState.aktywnosc = value;
      return "OK";
    }
    return "ERROR";
  }

  if (cmd.startsWith("AT+AKTOPADY=")) {
    const value = parseInt(cmd.split("=")[1]);
    if (value === 0 || value === 1) {
      deviceState.uwzglednijOpady = value;
      return "OK";
    }
    return "ERROR";
  }

  if (cmd.startsWith("AT+CZAS=")) {
    const dateTimeStr = cmd.split("=")[1];
    try {
      const [dateStr, timeStr] = dateTimeStr.split(",");
      const datetime = new Date(`${dateStr}T${timeStr}`);
      if (!isNaN(datetime.getTime())) {
        deviceState.customDateTime = datetime.toISOString();
        return "OK";
      }
    } catch (e) {
      return "ERROR";
    }
    return "ERROR";
  }

  if (cmd.startsWith("AT+SEKCJA=")) {
    const params = cmd.split("=")[1].split(",");
    const sekcja = parseInt(params[0]);
    const minuty = parseInt(params[1]);

    if (sekcja === -1 && minuty === -1) {
      // Turn off all sections and set irrigation inactive
      turn_off_irrigation();
      return "OK";
    }

    if (sekcja >= 1 && sekcja <= 8 && minuty > 0) {
      // Turn on specific section and set irrigation active
      // AT+SEKCJA=2,20 changes position 13, AT+SEKCJA=3,20 changes position 14
      // Position 13 = index 3 in sekcje array, so sekcja N changes index N+1
      deviceState.sekcje = [0, 0, 0, 0, 0, 0, 0, 0];
      deviceState.grupy = [0, 0, 0, 0, 0, 0, 0, 0];
      deviceState.sekcje[sekcja - 1] = 1;
      deviceState.irrigationActive = true;
      deviceState.irrigationStartTime =
        deviceState.customDateTime || new Date().toISOString();
      return "OK";
    }
    return "ERROR";
  }

  if (cmd.startsWith("AT+GRUPA=")) {
    const params = cmd.split("=")[1].split(",");
    const grupa = parseInt(params[0]);
    const minuty = parseInt(params[1]);

    if (grupa === -1 && minuty === -1) {
      // Turn off all sections and set irrigation inactive
      turn_off_irrigation();
      return "OK";
    }

    if (grupa >= 1 && grupa <= 8 && minuty > 0) {
      deviceState.sekcje = [0, 0, 0, 0, 0, 0, 0, 0];
      deviceState.grupy = [0, 0, 0, 0, 0, 0, 0, 0];
      deviceState.grupy[grupa - 1] = 1;

      let wyłączone_sekcje_w_grupie = 0;
      for (let i = 2; i <= 9; i++) {
        if (deviceState.grupySekcji[grupa][i] == 1) {
          deviceState.sekcje[i - 2] = 1;
        } else {
          deviceState.sekcje[i - 2] = 0;
          wyłączone_sekcje_w_grupie++;
        }
      }

      deviceState.irrigationActive = true;
      deviceState.irrigationStartTime =
        deviceState.customDateTime || new Date().toISOString();

      if (wyłączone_sekcje_w_grupie == 8) {
        turn_off_irrigation();
      }
      return "OK";
    }
    return "ERROR";
  }

  if (cmd.startsWith("AT+UST=")) {
    const params = cmd
      .split("=")[1]
      .split(",")
      .map((p) => parseInt(p));
    const pozycja = params[0];
    params.splice(3, 0, -1);
    if (pozycja >= 0 && pozycja <= 15) {
      deviceState.ustawienia[pozycja] = params;
      return "OK";
    }
    return "ERROR";
  }

  if (cmd.startsWith("AT+GR_UST=")) {
    const params = cmd
      .split("=")[1]
      .split(",")
      .map((p) => parseInt(p));
    const pozycja = params[0];
    params.splice(1, 0, 0);
    if (pozycja >= 1 && pozycja <= 8) {
      deviceState.grupySekcji[pozycja] = params;
      //   return "OK";
    }
    return "ERROR";
  }

  if (cmd.startsWith("AT+GRUPA_SEKCJA=")) {
    const value = parseInt(cmd.split("=")[1]);
    if (value === 1 || value === 2) {
      deviceState.trybPracy = value;
      return "OK";
    }
    return "ERROR";
  }

  return "ERROR";
}

udpServer.on("message", (msg, clientInfo) => {
  const command = msg.toString();
  const response = handleCommand(command, clientInfo);

  // Only send response if it's not null (i.e., not our own broadcast)
  if (response !== null) {
    const responseBuffer = Buffer.from(response);
    udpServer.send(
      responseBuffer,
      0,
      responseBuffer.length,
      clientInfo.port,
      clientInfo.address
    );
  }
});

udpServer.on("listening", () => {
  const address = udpServer.address();
  console.log(`UDP Server listening on ${address.address}:${address.port}`);

  setInterval(() => {
    const frame = generateFrame();
    const message = Buffer.from(frame);

    udpServer.setBroadcast(true);
    udpServer.send(
      message,
      0,
      message.length,
      UDP_PORT,
      "255.255.255.255",
      (err) => {
        if (err) {
          console.error("UDP broadcast error:", err);
        } else {
          console.log(`Frame sent: ${frame.substring(0, 50)}...`);
        }
      }
    );
  }, 1000);
});

udpServer.bind(UDP_PORT);
