import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Helmet from 'react-helmet'

import './index.css'
import screen from './screen.svg'
import DropboxButton from '../../components/DropboxButton'
import Footer from '../../components/Footer'
import VerifyProofButton from './components/VerifyProofButton'
import PublicAddNote from './components/PublicAddNote'
import FileDrop from './components/FileDrop'

class Home extends Component {
  render() {
    return (
      <div className="Home-wrapper">
        <Helmet>
          <title>Blocksync - sync your dropbox to the blockchain</title>
        </Helmet>
        <div className="Home-header">
          <div className="Home-logo">Blocksync</div>
          <div className="Home-nav">
            <Link to="/login" className="Home-navItem">
              Login
            </Link>
            <Link to="/register" className="Home-navItem">
              Register
            </Link>
            <VerifyProofButton />
          </div>
        </div>
        <div className="Home-firstRow">
          <div className="Home-leftCol">
            <div className="Home-imgWrap">
              <img src={screen} alt="" />
            </div>
          </div>
          <div className="Home-rightCol">
            <div className="Home-headText">
              <p>Blocksync places all your files in the blockchain.</p>
              <p>Automatically.</p>
            </div>
            <div className="Home-dbWrap">
              <DropboxButton />
            </div>
            <div className="Home-dontHave">
              {`Don't have a Dropbox? `}
              <Link to="/register">Create an account</Link> to upload and manage
              your files. Or, upload a single file below.
            </div>
          </div>
        </div>
        <div className="Home-secondRow">
          <div className="Home-secondRowLeft">
            <FileDrop />
          </div>
          <div className="Home-secondRowRight">
            <PublicAddNote />
          </div>
        </div>
        <div className="Home-teaserText">
          <h2>
            Blocksync allows you to cryptographically prove when your files were
            first created.
          </h2>
          <div className="Home-reasonWrap">
            <div className="Home-reasonItem">
              <h3>Intellectual Property</h3>
              <p>
                Asserting your intellectual property rights requires keeping
                careful track of when you develop your ideas and inventions. It
                is important to back your stated timeline with hard proof. By
                regularly syncing your Dropbox, you can generate proof just by
                working on your project and saving your ideas.
              </p>
            </div>
            <div className="Home-reasonItem">
              <h3>Finances and Fraud Prevention</h3>
              <p>
                Do you handle sensitive data which is vulnerable to fraud?
                Blocksync allows you to get piece of mind that none of your data
                will be tampered with after the fact. This is equally valuable
                for large corporate accounting as it is for tracking your
                child’s allowance.
              </p>
            </div>
            <div className="Home-reasonItem">
              <h3>Legal Documentation</h3>
              <p>
                Need to document a workplace issue or a series of events used in
                a legal proceeding? Blocksync makes this easy. Type up your
                notes just like normal and get rock solid proof of their
                validity. Solid credibility can be critical in any legal
                dispute.
              </p>
            </div>
            <div className="Home-reasonItem">
              <h3>Bragging rights</h3>
              <p>
                Have you ever made a great prediction and wanted to say “I told
                you so.” With Blocksync, all you have to do is place your
                thoughts in your Dropbox and you’ll have all the proof you need.
              </p>
            </div>
          </div>
        </div>
        <div className="Home-how">
          <h2>How it works</h2>
          <div className="Home-steps">
            <div className="Home-step">
              <div className="Home-stepNum">1.</div>
              <p>
                We sync your entire Dropbox and continue to sync any changes you
                make. Depending on the size of your Dropbox, this initial sync
                may take a day or two.
              </p>
            </div>
            <div className="Home-step">
              <div className="Home-stepNum">2.</div>
              <p>
                For each one of your files, we generate a cryptographically
                secure identifier which is unique to the file. We only store
                this identifier (hash). We never store your actual files.
              </p>
            </div>
            <div className="Home-step">
              <div className="Home-stepNum">3.</div>
              <p>
                We combine all of the identifiers so that we can use a single
                identifier to represent all the files. This is necessary because
                inserting tens of thousands of individual identifiers into the
                blockchain is not economically feasible.
              </p>
            </div>
            <div className="Home-step">
              <div className="Home-stepNum">4.</div>
              <p>
                We insert the single root identifier into the Bitcoin
                blockchain. After this step, you can know that any of your files
                existed at the time of insertion. The whole cycle will repeat as
                you update files in your Dropbox. Your Dropbox will be synced
                approximately every 12 hours.
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}

export default Home
