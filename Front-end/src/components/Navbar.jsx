import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

const NavBar = (props) => {
  async function LogOut() {
    const token = localStorage.getItem("accessToken");
    await fetch("http://localhost:4000/logout", {
      method: "DELETE",
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then((data) =>
      data.json().then((data) => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/";
      })
    );
  }

  return (
    <Navbar expand="lg" className="bg-body-tertiary" fixed="top">
      <Container>
        <Navbar.Brand href="/">PioneerPath</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Nav>
            <Nav.Link className="link" href="/match-mentor">
              Match with a Mentor
            </Nav.Link>
            <Nav.Link className="link" href="/meetup">
              In-Person Meet-up
            </Nav.Link>
            <Nav.Link className="link" href="/create-post">
              Create a Post
            </Nav.Link>
            <Nav.Link className="link" href="/member">
              See Posts
            </Nav.Link>
            <Nav.Link className="link" href="/articles">
              Articles
            </Nav.Link>
            {props.info && (
              <NavDropdown
                title={props.info.FirstName + " " + props.info.LastName}
                id="collapsible-nav-dropdown"
              >
                <NavDropdown.Item href="/settings">Settings</NavDropdown.Item>
                <NavDropdown.Item onClick={LogOut}>Sign Out</NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
