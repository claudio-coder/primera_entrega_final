import passport from "passport";
import local from "passport-local";
import GithubStrategy from "passport-github2";
import { userModel } from "../models/user.model.js";
import { createHash, isValidPassword } from "../utils/bcryptHash.js";
// import  {("dotenv").config}  from "dotenv";

const LocalStrategy = local.Strategy;

export const initPassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        const { first_name, last_name } = req.body;
        try {
          let userDB = await userModel.findOne({ email: username });
          if (userDB) return done(null, false);
          let newUser = {
            first_name,
            last_name,
            email: username,
            password: createHash(password),
          };
          let result = await userModel.create(newUser);
          return done(null, result);
        } catch (error) {
          return done("Error al obtener el usuario" + error);
        }
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await userModel.findOne({ _id: id });
    done(null, user);
  });

  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
      },
      async (username, password, done) => {
        const userDB = await userModel.findOne({ email: username });
        try {
          if (!userDB) return done(null, false);
          if (!isValidPassword(password, userDB)) return done(null, false);
          return done(null, userDB);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};

export const initPassportGithub = () => {
  passport.use(
    "github",
    new GithubStrategy(
      {
        // clientID: process.env.GITHUB_CLIENT_ID,
        // clientSecret: process.env.GITHUB_CLIENT_SECRET,
        // callbackURL: process.env.GITHUB_CALLBACK_URL,
        clientID: "Iv1.0452b9875377f2c3",
        clientSecret: "c1fc273bc4afc67fde810fb744f5ac2cc73e735a",
        callbackURL: "http://localhost:8080/api/session/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log("Pofile", profile);
        try {
          console.log("el email:", profile._json.email);
          let user = await userModel.findOne({
            email: "ccabanas@alonenet.com.ar",
          });
          //if(user)
          if (!user) {
            let newUser = {
              first_name: profile.username,
              last_name: profile.username,
              // email: profile._json.email,
              email: "ccabanas@alonenet.com.ar",
              password: "",
            };
            console.log("nno hay usuario", user);
            let result = await userModel.create(newUser);
            return done(null, result);
          }
          return done(null, user);
        } catch (error) {
          console.log(error);
        }
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await userModel.findOne({ _id: id });
    done(null, user);
  });
};
