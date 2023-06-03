import { Routes, Route } from "react-router-dom";
import { Home, Login, SignUp } from "./components";
import { useDispatch, useSelector } from "react-redux";
import { Snackbar, Alert, Box, CircularProgress } from "@mui/material";
import { snackbarDone } from "./store/SnackbarSlice";
function App() {
  const { status, text, severity } = useSelector((state) => state.snackBar);
  const { isLoading } = useSelector((state) => state.loader);
  const dispatch = useDispatch();
  return (
    <>
      <div className="App">
        <Routes>
          <Route path="/*" element={<Home />} />
          <Route path="login" element={<Login />} />
        </Routes>
      </div>
      <div>
        <Snackbar
          open={status}
          autoHideDuration={5000}
          onClose={() => dispatch(snackbarDone())}
        >
          <Alert
            onClose={() => dispatch(snackbarDone())}
            severity={severity}
            sx={{ width: "100%" }}
          >
            {text}
          </Alert>
        </Snackbar>
        {isLoading && (
          <div
            className="loader"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "fixed",
              top: "0px",
              left: "0px",
              width: "100vw",
              height: "100vh",
              background: "rgba(12,14,48, 0.7)",
              zIndex: "10",
            }}
          >
            <Box sx={{ display: "flex" }}>
              <CircularProgress style={{ color: "white" }} />
            </Box>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
