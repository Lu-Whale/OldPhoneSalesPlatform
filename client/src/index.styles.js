import styled from "styled-components";

const constants = {
  primaryColor: "#777",
};

const Wrapper = styled.section`
  ul {
    list-style: none;
  }
  
  a {
    text-decoration: none;
    color: #fff;
  }
  .flex-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .container {
    width: 80%;
    margin: 5rem auto;
  }
`;

export { constants };
export default Wrapper;
