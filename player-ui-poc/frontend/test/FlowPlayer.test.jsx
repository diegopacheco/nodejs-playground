import React from "react";
import { afterEach, expect, test, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { FlowPlayer } from "../src/FlowPlayer.jsx";
import signup from "../../backend/flows/signup.json";

afterEach(cleanup);

function renderSignup() {
  const onComplete = vi.fn();
  const onError = vi.fn();
  render(<FlowPlayer flow={structuredClone(signup)} onComplete={onComplete} onError={onError} />);
  return { onComplete, onError };
}

function type(label, value) {
  const input = screen.getByLabelText(label);
  fireEvent.change(input, { target: { value } });
  fireEvent.blur(input);
}

const click = (name) => fireEvent.click(screen.getByRole("button", { name }));

async function fillProfile() {
  await screen.findByText("Who are you?");
  type("Name", "Ana");
  type("Email", "ana@mail.com");
  click("Next");
  await screen.findByText("Hi Ana, pick a plan");
}

test("server side validation rules block navigation until the profile is valid", async () => {
  const { onComplete } = renderSignup();
  await screen.findByText("Who are you?");
  click("Next");
  expect(await screen.findByText("Name is required")).toBeTruthy();
  type("Name", "Ana");
  type("Email", "not-an-email");
  click("Next");
  expect(await screen.findByText("Email is not valid")).toBeTruthy();
  expect(screen.queryByText("Hi Ana, pick a plan")).toBeNull();
  expect(onComplete).not.toHaveBeenCalled();
});

test("the flow branches on the chosen plan and returns the collected data", async () => {
  const { onComplete } = renderSignup();
  await fillProfile();
  fireEvent.click(screen.getByLabelText("Pro - 10 USD per month"));
  click("Next");
  expect(await screen.findByText("Pro plan selected")).toBeTruthy();
  expect(screen.getByText("Ana (ana@mail.com) will be billed 10 USD per month.")).toBeTruthy();
  click("Confirm");
  await waitFor(() => expect(onComplete).toHaveBeenCalled());
  expect(onComplete.mock.calls[0][0]).toEqual({
    outcome: "DONE",
    data: { user: { name: "Ana", email: "ana@mail.com", plan: "pro" } },
  });
});

test("the default plan routes to the basic view", async () => {
  renderSignup();
  await fillProfile();
  click("Next");
  expect(await screen.findByText("Basic plan selected")).toBeTruthy();
});

test("back keeps what the user already typed", async () => {
  renderSignup();
  await fillProfile();
  click("Back");
  await screen.findByText("Who are you?");
  expect(screen.getByLabelText("Name").value).toBe("Ana");
});

test("cancel ends the flow with a CANCELLED outcome even with empty required fields", async () => {
  const { onComplete } = renderSignup();
  await screen.findByText("Who are you?");
  click("Cancel");
  await waitFor(() => expect(onComplete).toHaveBeenCalled());
  expect(onComplete.mock.calls[0][0].outcome).toBe("CANCELLED");
});
