import React, { Component } from "react";
import axios from "axios";

class Test extends Component {
  state = {
    posts: [],
    err: "",
    keywords: this.props.data
  };

  componentDidMount = () => {
    console.log("component mounting");

    const keywords = this.state.keywords;

    axios
      .post("/products/test", { keywords })
      .then(res => {
        const posts = res.data.results.map(el => {
          const newObj = {};
          newObj.title = el.title;
          newObj.image = el.image;
          newObj.price = el.price;
          newObj.num_reviews = el.num_reviews;
          newObj.stars = el.stars;
          newObj.product_id = el.product_id;
          return newObj;
        });
        this.setState({ posts: posts });
      })
      .catch(function(err) {
        console.log(err);
      });
  };

  render() {
    const { posts, err } = this.state;

    const prodName = posts.title && posts.title.split(" ").join("-");
    const amz = "http://amazon.com";

    const url = `${amz}/${prodName}/dp/`;
    return (
      <div>
        List of Products
        {posts.length
          ? posts.map(post => (
              <div key={post.product_id}>
                <a href={url + post.product_id}>
                  <div>
                    <img src={post.image} alt="product pic" />
                    <h1>{post.title}</h1>
                  </div>
                </a>
                --- ${post.price / 100} --- Star Rating: {post.stars} --- Number
                of Reviews: {post.num_reviews} ---
                {post.product_id} ---
              </div>
            ))
          : null}
        {err ? <div>{err}</div> : null}
        {/* <button onClick={getData}>Get my data</button> */}
      </div>
    );
  }
}

export default Test;
