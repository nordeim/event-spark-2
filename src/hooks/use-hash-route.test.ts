import { describe, expect, it } from "vitest";
import { parseHash } from "./use-hash-route";

describe("parseHash", () => {
  it("maps the empty hash to home", () => {
    expect(parseHash("")).toEqual({ view: "home" });
  });

  it("maps '#' to home", () => {
    expect(parseHash("#")).toEqual({ view: "home" });
  });

  it("maps '#/' to home", () => {
    expect(parseHash("#/")).toEqual({ view: "home" });
  });

  it("maps '#/auth' to the auth view with login preselected", () => {
    expect(parseHash("#/auth")).toEqual({ view: "auth", mode: "login" });
  });

  it("maps '#/auth?mode=signup' to the auth view with signup preselected", () => {
    expect(parseHash("#/auth?mode=signup")).toEqual({
      view: "auth",
      mode: "signup",
    });
  });

  it("maps '#/auth?mode=login' to the auth view with login preselected", () => {
    expect(parseHash("#/auth?mode=login")).toEqual({
      view: "auth",
      mode: "login",
    });
  });

  it("maps '#/auth/anything' to the 404 view (reference parity: subpaths 404)", () => {
    expect(parseHash("#/auth/anything")).toEqual({ view: "not-found" });
  });

  it("accepts a raw string without the leading '#'", () => {
    expect(parseHash("/auth?mode=signup")).toEqual({
      view: "auth",
      mode: "signup",
    });
  });

  it("maps an unknown hash to the 404 view", () => {
    expect(parseHash("#/nonexistent-page")).toEqual({ view: "not-found" });
  });

  it("maps a non-auth single segment to the 404 view", () => {
    expect(parseHash("#/dashboard")).toEqual({ view: "not-found" });
  });

  it("does not treat a similar-looking path as auth", () => {
    expect(parseHash("#/author")).toEqual({ view: "not-found" });
  });
});
