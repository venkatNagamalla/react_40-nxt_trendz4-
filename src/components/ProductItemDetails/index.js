/* eslint-disable jsx-a11y/control-has-associated-label */
// Write your code here
import {Component} from 'react'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import './index.css'
import SimilarProductItem from '../SimilarProductItem'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class ProductItemDetails extends Component {
  state = {
    productDetails: {},
    similarProductsDetails: [],
    apiStatus: apiStatusConstants.initial,
    quantity: 1,
  }

  componentDidMount() {
    this.getProducts()
  }

  getFormattedData = obj => ({
    availability: obj.availability,
    brand: obj.brand,
    description: obj.description,
    imageUrl: obj.image_url,
    price: obj.price,
    rating: obj.rating,
    totalReviews: obj.total_reviews,
    title: obj.title,
    style: obj.style,
    id: obj.id,
  })

  getProducts = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      const productData = this.getFormattedData(data)
      const similarProductsData = data.similar_products.map(eachProduct =>
        this.getFormattedData(eachProduct),
      )
      this.setState({
        productDetails: productData,
        similarProductsDetails: similarProductsData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoader = () => (
    <div data-testid="loader" className="loader-failure-container">
      <Loader color="#0b69fc" type="ThreeDots" height={80} width={80} />
    </div>
  )

  decrementQuantity = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(prevState => ({quantity: prevState.quantity - 1}))
    }
  }

  incrementQuantity = () =>
    this.setState(prevState => ({quantity: prevState.quantity + 1}))

  renderQuantityDetails = () => {
    const {quantity} = this.state
    return (
      <div className="quantity-container">
        <button
          data-testid="minus"
          onClick={this.decrementQuantity}
          className="quantity-btn"
          type="button"
        >
          <BsDashSquare className="quantity-icon" />
        </button>
        <p className="quantity">{quantity}</p>
        <button
          data-testid="plus"
          onClick={this.incrementQuantity}
          className="quantity-btn"
          type="button"
        >
          <BsPlusSquare className="quantity-icon" />
        </button>
      </div>
    )
  }

  renderSimilarProducts = () => {
    const {similarProductsDetails} = this.state
    return (
      <div className="similar-products-container">
        <h1 className="similar-products-heading">Similar Products</h1>
        <ul className="similar-products">
          {similarProductsDetails.map(eachProduct => (
            <SimilarProductItem product={eachProduct} key={eachProduct.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderProductDetails = () => {
    const {productDetails} = this.state
    const {
      brand,
      description,
      availability,
      imageUrl,
      title,
      price,
      rating,
      totalReviews,
    } = productDetails

    return (
      <div className="product-details-container">
        <div className="inner-container">
          <div className="desk-product-container">
            <div className="product-img-container">
              <img className="product-img" src={imageUrl} alt="product" />
            </div>
            <div className="description-container">
              <h1 className="title">{title}</h1>
              <p className="price">Rs {price}/-</p>
              <div className="rating-review-container">
                <div className="rating-container">
                  <p className="rating">{rating}</p>
                  <img
                    className="star-img"
                    src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                    alt="star"
                  />
                </div>
                <div className="reviews-container">
                  <p className="reviews">{totalReviews} Reviews</p>
                </div>
              </div>
              <p className="description">{description}</p>
              <p className="stock-checking">
                <span className="side-heading"> Available: </span>
                {availability}
              </p>
              <p className="stock-checking">
                <span className="side-heading">Brand: </span> {brand}
              </p>
              <hr />
              {this.renderQuantityDetails()}
              <button className="add-to-cart-btn" type="button">
                ADD TO CART
              </button>
            </div>
          </div>
          {this.renderSimilarProducts()}
        </div>
      </div>
    )
  }

  renderFailureDetails = () => (
    <div className="loader-failure-container">
      <img
        className="error-img"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png "
        alt="failure view"
      />
      <h1 className="error-msg">Product Not Found</h1>
      <Link to="/products">
        <button className="continue-shopping" type="button">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  renderSwitchStatements = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      case apiStatusConstants.success:
        return this.renderProductDetails()
      case apiStatusConstants.failure:
        return this.renderFailureDetails()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderSwitchStatements()}
      </>
    )
  }
}

export default ProductItemDetails
