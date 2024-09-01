const request = require("supertest");
const app = require("../../app");
const { mongoConnect, mongoDisconnect } = require("../../services/mongo");

jest.setTimeout(20000);

describe("TESTING API", () => {
  beforeAll(async () => {
    await mongoConnect();
  });

  afterAll(async () => {
    await mongoDisconnect(); 
  });

  describe("TEST GET / launches", () => {
    test("It should respond with 200 success", async () => {
      const response = await request(app)
        .get("/launches")
        .expect("Content-Type", /json/)
        .expect(200);
    });
  });

  describe("TEST POST / launch", () => {
    const launchData = {
      mission: "USSR F2",
      rocket: "Falcon 2-D",
      target: "Kepler-62 f",
      launchDate: "Jan 5, 2025",
    };

    const launchDataWithoutDate = {
      mission: "USSR F2",
      rocket: "Falcon 2-D",
      target: "Kepler-62 f",
    };

    const launchDataWithInvalidDate = {
      mission: "USSR F2",
      rocket: "Falcon 2-D",
      target: "Kepler-62 f",
      launchDate: "J7, 2025",
    };

    test("It should respond with 201 created", async () => {
      const response = await request(app)
        .post("/launches")
        .send(launchData)
        .expect("Content-Type", /json/)
        .expect(201);

      const requestDate = new Date(launchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();

      expect(responseDate).toBe(requestDate);
      expect(response.body).toMatchObject(launchDataWithoutDate);
    });

    test("It should catch missing required properties", async () => {
      const response = await request(app)
        .post("/launches")
        .send(launchDataWithoutDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "Missing required launch details",
      });
    });

    test("It should catch invalid dates", async () => {
      const response = await request(app)
        .post("/launches")
        .send(launchDataWithInvalidDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "Invalid launch date",
      });
    });
  });
});
