import { AuthProvider, useAuth } from "../contexts/AuthProvider";
import ToasterProvider from "../contexts/ToasterProvider";

function Providers({ children }) {
  return (
    <ToasterProvider>
      <AuthProvider>{children}</AuthProvider>
    </ToasterProvider>
  );
}

function AuthGate({ children }) {
  const { isPending } = useAuth();

  if (isPending) {
    // 인증이 다 처리될 때까지 기다리자
    return null;
  }

  return children;
}

function App({ children }) {
  return (
    <Providers>
      <AuthGate>{children}</AuthGate>
    </Providers>
  );
}

export default App;
