const express = require("express");
const admin = require("firebase-admin");
const serviceAccount = require("./bloom-qa-7d4ff-firebase-adminsdk-3mwkl-731679b891.json");
const getuserbyemailservice = require("./services/getUserbyEmailService");
const deleteAuthUserService = require("./services/deleteAuthUserService");
const deleteRoomService = require("./services/deleteRoomService");
const deleteUserService = require("./services/deleteUserService");
const Result = require("folktale/result");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
app.use(express.json());

//unwrap the folktale result
const getValueFromResult = (result) =>
  result.matchWith({
    Ok: ({ value }) => value,
    Error: ({ value }) => value,
  });

app.post("/authenticateNumbers", async (req, res) => {
  const numbers = req.body;

  const result = await composeResult(
    (authUsers) => deleteAuthUser(authUsers),
    (authUsers) => deleteUser(authUsers),
    (authUsers) => deleteRooms(authUsers),
    () => CheckAuth(numbers, res)
  );
  res.status(200).json({ result: getValueFromResult(result) });
});

const deleteAuthUser = (authUsers) => {
  authUsers.map(async (user) => {
    const deletedUser = await deleteAuthUserService.deleteAuthUser(user.uid);
    console.log("deletedAuthUser", getValueFromResult(deletedUser));
  });
  return Result.Ok(authUsers);
};

const deleteUser = async (authUsers) => {
  authUsers.map(async (auth) => {
    const result = await deleteUserService.deleteUser(auth.uid);
    console.log("deletedUser", getValueFromResult(result));
  });

  return Result.Ok(authUsers);
};

const deleteRooms = async (authUsers) => {
  authUsers.map(async (auth) => {
    const result = await composeResult(() =>
      deleteRoomService.deleteRoom(auth.uid)
    );
    console.log("deletedRoom", getValueFromResult(result));
  });

  return Result.Ok(authUsers);
};

const CheckAuth = async (numbers) => {
  const authUsers = [];
  await Promise.all(
    numbers.map(async (number) => {
      const user = await getuserbyemailservice.isUserExist(
        `+91${number}@gmail.com`
      );
      const finalUser = await getValueFromResult(user);

      if (finalUser) {
        authUsers.push(finalUser);
      }
    })
  );
  return await Result.Ok(authUsers);
};

const composeResult = async (...args) => {
  const reverse = args.reverse();
  let pram;

  for (let i = 0; i < reverse.length; i++) {
    if (i == 0) {
      pram = await reverse[i]();
      if (pram === null) {
        break;
      }
    } else {
      pram = await reverse[i](pram.merge());
    }
  }
  return pram;
};

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
