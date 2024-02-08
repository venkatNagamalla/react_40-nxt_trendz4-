// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {product} = props
  const {title, imageUrl, brand, price, rating} = product

  return (
    <li className="list-item">
      <img className="similar-img" src={imageUrl} alt="similar product" />
      <h1 className="title-heading">{title}</h1>
      <p className="brand-desc">by {brand}</p>
      <div className="price-rating-container">
        <p className="price-amount">Rs {price}/-</p>
        <div className="ratings-container">
          <p className="rating">{rating}</p>
          <img
            className="star-img"
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
