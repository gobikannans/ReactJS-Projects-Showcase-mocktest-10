import {Component} from 'react'
import Loader from 'react-loader-spinner'
import './App.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inProgress: 'INPROGRESS',
  failure: 'FAILURE',
}

class App extends Component {
  state = {
    projectsList: [],
    selectedValue: categoriesList[0].id,
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProjectsData()
  }

  getProjectsData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {selectedValue} = this.state

    const url = `https://apis.ccbp.in/ps/projects?category=${selectedValue}`
    const options = {
      method: 'GET',
    }

    const response = await fetch(url, options)
    console.log(response)
    if (response.ok) {
      const data = await response.json()
      console.log(data)
      const fetchedData = data.projects.map(eachItem => ({
        id: eachItem.id,
        imgUrl: eachItem.image_url,
        name: eachItem.name,
      }))
      this.setState({
        projectsList: fetchedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onChangeSelect = event => {
    this.setState({selectedValue: event.target.value}, this.getProjectsData)
  }

  renderProjectContainer = () => {
    const {projectsList} = this.state
    return (
      <ul className="projects-list-container">
        {projectsList.map(eachItem => (
          <li key={eachItem.id} className="projects-list-item">
            <img
              src={eachItem.imgUrl}
              alt={eachItem.name}
              className="project-img"
            />
            <p className="project-name">{eachItem.name}</p>
          </li>
        ))}
      </ul>
    )
  }

  renderLoaderContainer = () => (
    <div data-testid="loader" className="loader-container">
      <Loader type="ThreeDots" color="#328af2" height={50} width={50} />
    </div>
  )

  renderFailureContainer = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failure-img"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-para">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        type="button"
        className="failure-btn"
        onClick={this.getProjectsData}
      >
        Retry
      </button>
    </div>
  )

  renderProjectApiStatus = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProjectContainer()
      case apiStatusConstants.inProgress:
        return this.renderLoaderContainer()
      case apiStatusConstants.failure:
        return this.renderFailureContainer()
      default:
        return null
    }
  }

  render() {
    const {selectedValue} = this.state
    return (
      <>
        <div className="header-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
            className="website-logo"
          />
        </div>
        <div className="bg-container">
          <div className="project-container">
            <select
              className="select"
              value={selectedValue}
              onChange={this.onChangeSelect}
            >
              {categoriesList.map(eachItem => (
                <option value={eachItem.id} key={eachItem.id}>
                  {eachItem.displayText}
                </option>
              ))}
            </select>
            {this.renderProjectApiStatus()}
          </div>
        </div>
      </>
    )
  }
}

export default App
