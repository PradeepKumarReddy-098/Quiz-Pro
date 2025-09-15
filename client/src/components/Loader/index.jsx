import { SyncLoader } from "react-spinners";
import ErrorImg from '../../assets/error-image.png'
import Navbar from "../Navbar";
import './index.css'


const override = {
  display: "block",
  position: "absolute",
  top: "40%",
  left: "47%",
  margin: "auto",
  borderColor: "red",
};

export const Loader = () => {
  return (
    <>
    <Navbar></Navbar>
    <SyncLoader
      color={"#1976d2"}
      size={20}
      cssOverride={override}
      aria-label="Loading Spinner"
      data-testid="loader"
    />
    </>
  );
};

export const ErrorPage = () => {
    return (
        <>
        <Navbar></Navbar>
        <div className="error-page">
            <img src={ErrorImg} alt="error-image" />
            <h2>Something went wrong</h2>
            <p>please Logout and Try angin!</p>
        </div>
        </>
    )
}
