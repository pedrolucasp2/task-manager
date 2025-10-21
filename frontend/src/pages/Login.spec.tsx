import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { LoginPage } from "./Login";
import { AuthProvider } from "../contexts/AuthProvider";
import api from "../services/api";


//Mock do Axios
jest.mock("../services/api");

// Mock do useNavigate
const mockedNavigate = jest.fn(); 
jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...(actual as object),
    useNavigate: () => mockedNavigate,
  };
});
// --- Fim dos Mocks ---

describe("LoginPage", () => {
  const renderComponent = () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render login form elements correctly", () => {
    renderComponent();
    expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /entrar/i })).toBeInTheDocument();
    expect(screen.getByText(/não tem uma conta?/i)).toBeInTheDocument();
  });

  it("should display validation errors when submitting empty fields", async () => {
    renderComponent();
    const submitButton = screen.getByRole("button", { name: /entrar/i });
    fireEvent.click(submitButton);
    expect(await screen.findByText(/e-mail inválido/i)).toBeInTheDocument();
    expect(
      await screen.findByText(/a senha é obrigatória/i)
    ).toBeInTheDocument();
    expect(api.post).not.toHaveBeenCalled();
  });

  it("should call api.post with credentials and navigate on successful login", async () => {
    const mockToken = "fake-jwt-token-123";
    (api.post as jest.Mock).mockResolvedValueOnce({
      data: { access_token: mockToken },
    });

    renderComponent();
    fireEvent.change(screen.getByLabelText(/e-mail/i), {
      target: { value: "test@success.com" },
    });
    fireEvent.change(screen.getByLabelText(/senha/i), {
      target: { value: "password123" },
    });
    const submitButton = screen.getByRole("button", { name: /entrar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/auth/login", {
        email: "test@success.com",
        password: "password123",
      });
    });
    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("should display an error message on failed login from API", async () => {
    (api.post as jest.Mock).mockRejectedValueOnce({
      response: { status: 401 },
    });

    renderComponent();
    fireEvent.change(screen.getByLabelText(/e-mail/i), {
      target: { value: "wrong@fail.com" },
    });
    fireEvent.change(screen.getByLabelText(/senha/i), {
      target: { value: "wrongpassword" },
    });
    const submitButton = screen.getByRole("button", { name: /entrar/i });
    fireEvent.click(submitButton);

    expect(
      await screen.findByText(/e-mail ou senha inválidos/i)
    ).toBeInTheDocument();
    expect(mockedNavigate).not.toHaveBeenCalled();
  });
});
