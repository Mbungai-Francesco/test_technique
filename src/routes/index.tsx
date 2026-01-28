import { Link, createFileRoute } from '@tanstack/react-router'
import { CheckCircle, Database, Lock, Scan, Shield, Zap } from 'lucide-react';

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="pt-20 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full mb-6">
            <Zap className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Powered by VirusTotal API</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Secure Your Android Apps
            <br />
            <span className="text-blue-600">Before It's Too Late</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Upload, analyze, and manage your Android application library with 
            real-time malware detection powered by VirusTotal's comprehensive 
            antivirus database.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
            >
              Start Scanning Now
            </Link>
            <a
              href="#features"
              className="px-8 py-4 bg-white text-gray-700 rounded-lg hover:bg-gray-50 font-semibold text-lg border-2 border-gray-200 transition-all"
            >
              Learn More
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-20 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">68+</div>
              <div className="text-gray-600 mt-2">Antivirus Engines</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">100%</div>
              <div className="text-gray-600 mt-2">Secure Storage</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">24/7</div>
              <div className="text-gray-600 mt-2">Monitoring</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for App Security
            </h2>
            <p className="text-xl text-gray-600">
              Comprehensive tools to keep your application library safe
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Scan className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Real-Time Scanning
              </h3>
              <p className="text-gray-700">
                Automatic malware detection using VirusTotal's extensive database 
                of 68+ antivirus engines. Get instant results on every upload.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-purple-600 rounded-xl flex items-center justify-center mb-6">
                <Database className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Centralized Library
              </h3>
              <p className="text-gray-700">
                Store and manage all your Android applications in one secure place. 
                Add notes, comments, and organize your entire APK collection.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-green-600 rounded-xl flex items-center justify-center mb-6">
                <Lock className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Secure Storage
              </h3>
              <p className="text-gray-700">
                Your applications are stored securely with SHA-256 hashing and 
                encrypted database storage. Full ACID compliance guaranteed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Three simple steps to secure your apps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Upload Your APK
              </h3>
              <p className="text-gray-600">
                Simply drag and drop your Android application file. We support 
                files up to 100MB.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Automatic Scanning
              </h3>
              <p className="text-gray-600">
                Our system automatically queues your app for VirusTotal analysis 
                and processes results in real-time.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Get Results
              </h3>
              <p className="text-gray-600">
                View detailed security reports, manage your library, and keep 
                track of all your applications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Why Choose Cesco Security?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Built with modern technologies and security best practices 
                to provide you with the most reliable app security platform.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Smart Deduplication</h4>
                    <p className="text-gray-600">Automatic detection of duplicate files using SHA-256 hashing</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Rate Limited API</h4>
                    <p className="text-gray-600">Intelligent queue system respecting VirusTotal's 4 requests/minute limit</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Comprehensive Reports</h4>
                    <p className="text-gray-600">Detailed scan results with links to full VirusTotal reports</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Easy Management</h4>
                    <p className="text-gray-600">Add custom names and comments to organize your app library</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8 h-full flex items-center justify-center">
              <div className="text-center">
                <Shield className="w-32 h-32 text-blue-600 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Enterprise-Grade Security
                </h3>
                <p className="text-gray-700">
                  Your data is protected with industry-standard encryption and 
                  secure authentication using HttpOnly cookies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Secure Your Apps?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join developers who trust Cesco Security for their Android application management
          </p>
          <Link
            to="/register"
            className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
          >
            Create Free Account
          </Link>
        </div>
      </section>
    </div>
  )
}
