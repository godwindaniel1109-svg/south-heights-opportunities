import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import './PageContent.css'

const JobsPage = () => {
  const { user, hasApprovedDWT } = useAuth()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')

  if (!hasApprovedDWT()) {
    return (
      <div className="page-content">
        <div className="access-denied">
          <h2>🔒 Access Restricted</h2>
          <p>You need to purchase and have approved DWT tokens to view job opportunities.</p>
          <button 
            onClick={() => navigate('/dashboard/buy-dwt')}
            className="btn-primary"
          >
            Buy DWT Now
          </button>
        </div>
      </div>
    )
  }

  // Pennsylvania-based job listings - covering major cities and streets across PA
  const jobs = [
    // Philadelphia jobs
    { id: 1, title: 'Software Developer', company: 'Tech Innovators PA', location: '123 Market St, Philadelphia, PA', salary: '$85,000 - $125,000', description: 'Build scalable applications in Philadelphia tech hub on Market Street.' },
    { id: 2, title: 'Marketing Manager', company: 'Philly Marketing Group', location: '456 Broad St, Philadelphia, PA', salary: '$75,000 - $110,000', description: 'Lead marketing initiatives for growing startup on Broad Street.' },
    { id: 3, title: 'Sales Representative', company: 'StateWide Sales', location: '789 Chestnut St, Philadelphia, PA', salary: '$55,000 - $95,000', description: 'B2B sales role covering PA region from Chestnut Street office.' },
    { id: 4, title: 'Customer Service Lead', company: 'PA Support Services', location: '321 Walnut St, Philadelphia, PA', salary: '$50,000 - $75,000', description: 'Lead customer support team in East PA on Walnut Street.' },
    { id: 5, title: 'Financial Analyst', company: 'Liberty Financial', location: '555 Arch St, Philadelphia, PA', salary: '$70,000 - $100,000', description: 'Financial analysis role in downtown Philadelphia on Arch Street.' },
    
    // Pittsburgh jobs
    { id: 6, title: 'Registered Nurse', company: 'UPMC Health', location: '200 Forbes Ave, Pittsburgh, PA', salary: '$65,000 - $90,000', description: 'Join our healthcare team in Western PA on Forbes Avenue.' },
    { id: 7, title: 'Construction Supervisor', company: 'PA Construction Co', location: '150 Grant St, Pittsburgh, PA', salary: '$80,000 - $120,000', description: 'Oversee construction projects across PA from Grant Street office.' },
    { id: 8, title: 'HR Manager', company: 'Pennsylvania Corp', location: '300 Penn Ave, Pittsburgh, PA', salary: '$72,000 - $105,000', description: 'HR leadership role for growing company on Penn Avenue.' },
    { id: 9, title: 'Mechanical Engineer', company: 'Steel City Engineering', location: '425 Liberty Ave, Pittsburgh, PA', salary: '$75,000 - $110,000', description: 'Engineering role in Pittsburgh on Liberty Avenue.' },
    
    // Harrisburg jobs
    { id: 10, title: 'Data Analyst', company: 'Analytics Hub', location: '100 State St, Harrisburg, PA', salary: '$68,000 - $98,000', description: 'Drive insights with data in PA capital on State Street.' },
    { id: 11, title: 'Government Relations Specialist', company: 'Capitol Consulting', location: '250 N 3rd St, Harrisburg, PA', salary: '$65,000 - $95,000', description: 'Work with state government on North 3rd Street.' },
    { id: 12, title: 'Legal Assistant', company: 'Harrisburg Law Group', location: '500 Market St, Harrisburg, PA', salary: '$45,000 - $65,000', description: 'Legal support role in Harrisburg on Market Street.' },
    
    // Allentown jobs
    { id: 13, title: 'Electrician', company: 'PA Electrical Services', location: '600 Hamilton St, Allentown, PA', salary: '$60,000 - $85,000', description: 'Licensed electrician for commercial projects on Hamilton Street.' },
    { id: 14, title: 'Operations Manager', company: 'Lehigh Valley Operations', location: '750 7th St, Allentown, PA', salary: '$70,000 - $100,000', description: 'Operations management on 7th Street in Allentown.' },
    
    // Bethlehem jobs
    { id: 15, title: 'Manufacturing Engineer', company: 'Precision Manufacturing', location: '800 Main St, Bethlehem, PA', salary: '$70,000 - $105,000', description: 'Design and optimize manufacturing processes on Main Street.' },
    { id: 16, title: 'Quality Control Specialist', company: 'Bethlehem Quality Co', location: '950 Broad St, Bethlehem, PA', salary: '$55,000 - $80,000', description: 'Quality control role on Broad Street in Bethlehem.' },
    
    // Erie jobs
    { id: 17, title: 'Marine Technician', company: 'Erie Marine Services', location: '120 State St, Erie, PA', salary: '$50,000 - $75,000', description: 'Marine services technician on State Street in Erie.' },
    { id: 18, title: 'Retail Manager', company: 'Erie Retail Group', location: '350 Peach St, Erie, PA', salary: '$45,000 - $65,000', description: 'Retail management position on Peach Street.' },
    
    // Reading jobs
    { id: 19, title: 'Warehouse Supervisor', company: 'Reading Distribution', location: '200 Penn St, Reading, PA', salary: '$55,000 - $80,000', description: 'Warehouse operations on Penn Street in Reading.' },
    { id: 20, title: 'Logistics Coordinator', company: 'PA Logistics Solutions', location: '450 5th St, Reading, PA', salary: '$50,000 - $70,000', description: 'Coordinate logistics from 5th Street office in Reading.' },
    
    // Scranton jobs
    { id: 21, title: 'Healthcare Administrator', company: 'Scranton Medical Center', location: '600 Lackawanna Ave, Scranton, PA', salary: '$65,000 - $90,000', description: 'Healthcare administration on Lackawanna Avenue.' },
    { id: 22, title: 'IT Support Specialist', company: 'Northeast IT Services', location: '750 Mulberry St, Scranton, PA', salary: '$50,000 - $75,000', description: 'IT support role on Mulberry Street in Scranton.' },
    
    // Lancaster jobs
    { id: 23, title: 'Agricultural Specialist', company: 'Lancaster Ag Solutions', location: '300 King St, Lancaster, PA', salary: '$55,000 - $80,000', description: 'Agricultural consulting on King Street in Lancaster.' },
    { id: 24, title: 'Tourism Coordinator', company: 'PA Tourism Board', location: '150 Queen St, Lancaster, PA', salary: '$45,000 - $65,000', description: 'Tourism coordination on Queen Street.' },
    
    // York jobs
    { id: 25, title: 'Production Manager', company: 'York Manufacturing', location: '400 Market St, York, PA', salary: '$70,000 - $100,000', description: 'Production management on Market Street in York.' },
    { id: 26, title: 'Accountant', company: 'York Financial Services', location: '550 George St, York, PA', salary: '$60,000 - $85,000', description: 'Accounting role on George Street in York.' },
    
    // State College jobs
    { id: 27, title: 'Research Assistant', company: 'Penn State Research', location: '100 College Ave, State College, PA', salary: '$40,000 - $60,000', description: 'Research position on College Avenue near Penn State.' },
    { id: 28, title: 'Education Coordinator', company: 'State College Education', location: '250 Beaver Ave, State College, PA', salary: '$50,000 - $70,000', description: 'Education coordination on Beaver Avenue.' },
    
    // Altoona jobs
    { id: 29, title: 'Railway Operations Manager', company: 'Altoona Rail Services', location: '500 11th Ave, Altoona, PA', salary: '$65,000 - $90,000', description: 'Railway operations on 11th Avenue in Altoona.' },
    
    // Johnstown jobs
    { id: 30, title: 'Maintenance Technician', company: 'Johnstown Maintenance Co', location: '300 Main St, Johnstown, PA', salary: '$45,000 - $65,000', description: 'Maintenance role on Main Street in Johnstown.' },
  ]

  const filtered = jobs.filter(j => 
    j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.company.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="page-content">
      <div className="page-header">
        <h2>💼 Job Opportunities in Pennsylvania</h2>
        <p>Discover career opportunities across PA</p>
      </div>

      <div className="search-bar">
        <input 
          type="text"
          placeholder="Search by title, location, or company..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="jobs-list">
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#666' }}>
            <p>No jobs match your search. Try different keywords.</p>
          </div>
        ) : (
          filtered.map((job) => (
            <div key={job.id} className="job-card">
              <div className="job-header">
                <h3>{job.title}</h3>
                <span className="job-company">{job.company}</span>
              </div>
              <div className="job-details">
                <span className="job-location">📍 {job.location}</span>
                <span className="job-salary">💰 {job.salary}</span>
              </div>
              <p className="job-description">{job.description}</p>
              <button className="btn-apply">Apply Now</button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default JobsPage
