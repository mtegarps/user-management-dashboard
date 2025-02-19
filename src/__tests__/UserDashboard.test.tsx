import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import createTestStore from "./testStore"; // Import test store
import UserDashboard from "../components/UserDashboard";
import { updateUser, deleteUser } from "../store/userSlice";
import { Store, UnknownAction } from "@reduxjs/toolkit";

// Mock Redux actions
jest.mock("../store/userSlice", () => ({
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
}));

const initialState = {
  users: {
    users: [
      {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        company: { name: "Company A" },
      },
      {
        id: 2,
        name: "Jane Smith",
        email: "jane@example.com",
        company: { name: "Company B" },
      },
    ],
    loading: false,
    error: null,
  },
};

// Fungsi untuk render dengan store Redux
const renderWithStore = (store: Store<unknown, UnknownAction, unknown>) => {
  return render(
    <Provider store={store}>
      <UserDashboard />
    </Provider>
  );
};

test("renders UserDashboard correctly", () => {
  const store = createTestStore(initialState);
  renderWithStore(store);
  expect(screen.getByText("User Management Dashboard")).toBeInTheDocument();
});

test("displays user data correctly", () => {
  const store = createTestStore(initialState);
  renderWithStore(store);
  expect(screen.getByText("John Doe")).toBeInTheDocument();
  expect(screen.getByText("jane@example.com")).toBeInTheDocument();
});

test("search filters users correctly", () => {
  const store = createTestStore(initialState);
  renderWithStore(store);
  const searchInput = screen.getByPlaceholderText("Search by name or company");
  fireEvent.change(searchInput, { target: { value: "Jane" } });
  expect(screen.getByText("Jane Smith")).toBeInTheDocument();
  expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
});

test("opens edit modal and updates user", () => {
  const store = createTestStore(initialState);
  renderWithStore(store);
  fireEvent.click(screen.getAllByText("Edit")[0]);
  expect(screen.getByText("Edit User")).toBeInTheDocument();
  fireEvent.change(screen.getByDisplayValue("John Doe"), {
    target: { value: "John Updated" },
  });
  fireEvent.click(screen.getByText("Save"));
  expect(updateUser).toHaveBeenCalled();
});

test("opens delete modal and deletes user", () => {
  const store = createTestStore(initialState);
  renderWithStore(store);
  fireEvent.click(screen.getAllByText("Delete")[0]);
  expect(
    screen.getByText("Apakah Anda yakin ingin menghapus?")
  ).toBeInTheDocument();
  fireEvent.click(screen.getByText("Yes"));
  expect(deleteUser).toHaveBeenCalled();
});

test("pagination works correctly", () => {
  const store = createTestStore({
    users: {
      users: Array.from({ length: 12 }, (_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        company: { name: `Company ${i + 1}` },
      })),
      loading: false,
      error: null,
    },
  });
  renderWithStore(store);
  expect(screen.getByText("User 1")).toBeInTheDocument();
  fireEvent.click(screen.getByText("2"));
  expect(screen.getByText("User 6")).toBeInTheDocument();
});
