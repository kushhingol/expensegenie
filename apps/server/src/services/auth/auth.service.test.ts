import {
  verifyGoogleToken,
  createOrGetUser,
  generateJWT,
} from "./auth.service";
import { googleClient } from "../../config/google";
import { User } from "../../models/user.model";
import jwt from "jsonwebtoken";

jest.mock("../../config/google", () => ({
  googleClient: {
    verifyIdToken: jest.fn(),
  },
  CLIENT_IDS: ["test-client-id"],
}));

jest.mock("../../models/user.model", () => ({
  User: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

describe("Auth Service Tests", () => {
  /* ---------- verifyGoogleToken ---------- */
  describe("verifyGoogleToken()", () => {
    it("should verify token and return payload", async () => {
      const mockPayload = {
        sub: "12345",
        email: "test@email.com",
      };

      (googleClient.verifyIdToken as jest.Mock).mockResolvedValue({
        getPayload: () => mockPayload,
      });

      const token = "dummy-id-token";
      const result = await verifyGoogleToken(token);

      expect(googleClient.verifyIdToken).toHaveBeenCalledWith({
        idToken: token,
        audience: ["test-client-id"],
      });
      expect(result).toEqual(mockPayload);
    });
  });

  /* ---------- createOrGetUser ---------- */
  describe("createOrGetUser()", () => {
    it("should return existing user if found", async () => {
      const mockUser = { id: "user123", name: "Existing User" };

      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      const payload = { sub: "google-123" };
      const result = await createOrGetUser(payload);

      expect(User.findOne).toHaveBeenCalledWith({ googleId: payload.sub });
      expect(result).toBe(mockUser);
    });

    it("should create a new user if not found", async () => {
      const payload = {
        sub: "google-123",
        name: "New User",
        email: "new@test.com",
        picture: "test-pic",
      };

      (User.findOne as jest.Mock).mockResolvedValue(null);
      (User.create as jest.Mock).mockResolvedValue(payload);

      const result = await createOrGetUser(payload);

      expect(User.create).toHaveBeenCalledWith({
        googleId: payload.sub,
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
      });

      expect(result).toEqual(payload);
    });
  });

  /* ---------- generateJWT ---------- */
  describe("generateJWT()", () => {
    it("should create jwt token", () => {
      const mockToken = "mock.jwt.token";
      (jwt.sign as jest.Mock).mockReturnValue(mockToken);

      const userId = "user123";
      const token = generateJWT(userId);

      expect(jwt.sign).toHaveBeenCalledWith(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
      expect(token).toBe(mockToken);
    });
  });
});
