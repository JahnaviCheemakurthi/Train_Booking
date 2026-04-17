// ============================================
// TRAIN TICKET BOOKING SYSTEM - UTILITIES
// ============================================

// LocalStorage Keys
const STORAGE_KEYS = {
    USERS: 'trainBooking_users',
    CURRENT_USER: 'trainBooking_currentUser',
    TRAINS: 'trainBooking_trains',
    BOOKINGS: 'trainBooking_bookings',
    ADMINS: 'trainBooking_admins'
};

// Initialize default data
function initializeDefaultData() {
    // Initialize trains if not exists
    if (!localStorage.getItem(STORAGE_KEYS.TRAINS)) {
        const defaultTrains = [
            {
                trainNumber: '12345',
                trainName: 'Rajdhani Express',
                origin: 'Mumbai',
                destination: 'Delhi',
                departureTime: '18:00',
                arrivalTime: '08:00',
                totalSeats: 100,
                availableSeats: 100,
                ownership: 'Indian Railways',
                fares: {
                    firstClass: 5000,
                    acTier1: 3500,
                    acTier2: 2000,
                    sleeper: 1000
                }
            },
            {
                trainNumber: '22222',
                trainName: 'Shatabdi Express',
                origin: 'Mumbai',
                destination: 'Bangalore',
                departureTime: '06:00',
                arrivalTime: '15:30',
                totalSeats: 100,
                availableSeats: 100,
                ownership: 'Indian Railways',
                fares: {
                    firstClass: 4500,
                    acTier1: 3000,
                    acTier2: 1800,
                    sleeper: 900
                }
            },
            {
                trainNumber: '33333',
                trainName: 'Duronto Express',
                origin: 'Delhi',
                destination: 'Chennai',
                departureTime: '20:00',
                arrivalTime: '10:30',
                totalSeats: 100,
                availableSeats: 100,
                ownership: 'Indian Railways',
                fares: {
                    firstClass: 5500,
                    acTier1: 3800,
                    acTier2: 2200,
                    sleeper: 1100
                }
            },
            {
                trainNumber: '44444',
                trainName: 'Garib Rath',
                origin: 'Ahmedabad',
                destination: 'Mumbai',
                departureTime: '14:00',
                arrivalTime: '22:00',
                totalSeats: 100,
                availableSeats: 100,
                ownership: 'Indian Railways',
                fares: {
                    firstClass: 3000,
                    acTier1: 2000,
                    acTier2: 1200,
                    sleeper: 600
                }
            }
        ];
        localStorage.setItem(STORAGE_KEYS.TRAINS, JSON.stringify(defaultTrains));
    }

    // Initialize admin if not exists
    if (!localStorage.getItem(STORAGE_KEYS.ADMINS)) {
        const defaultAdmin = [{
            email: 'admin@trainbooking.com',
            password: 'Admin@123',
            name: 'System Administrator'
        }];
        localStorage.setItem(STORAGE_KEYS.ADMINS, JSON.stringify(defaultAdmin));
    }

    // Initialize empty users if not exists
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([]));
    }

    // Initialize empty bookings if not exists
    if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
        localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify([]));
    }
}

// Validation Functions
const Validation = {
    // Email validation
    validateEmail(email) {
        const regex = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        if (!email || !regex.test(email)) {
            throw new Error('Invalid email format. Must contain @ and domain');
        }
        return true;
    },

    // Mobile validation (starts with 6/7/8/9, 10 digits)
    validateMobile(mobile) {
        const regex = /^[6-9][0-9]{9}$/;
        if (!mobile || !regex.test(mobile)) {
            throw new Error('Mobile number must start with 6/7/8/9 and be 10 digits');
        }
        return true;
    },

    // Username validation (min 6 characters, only letters)
    validateUsername(username) {
        const regex = /^[A-Za-z]{6,50}$/;
        if (!username || !regex.test(username)) {
            throw new Error('Username must be at least 6 characters, only letters');
        }
        return true;
    },

    // Password validation (min 8 chars, 1 uppercase, 1 number, 1 special char)
    validatePassword(password) {
        const regex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\S+$).{8,}$/;
        if (!password || !regex.test(password)) {
            throw new Error('Password must be 8+ characters with 1 uppercase, 1 number, 1 special character');
        }
        return true;
    },

    // Password match validation
    validatePasswordMatch(password, confirmPassword) {
        if (password !== confirmPassword) {
            throw new Error('Passwords do not match');
        }
        return true;
    },

    // Aadhar validation (12 digits)
    validateAadhar(aadhar) {
        const regex = /^[0-9]{12}$/;
        if (!aadhar || !regex.test(aadhar)) {
            throw new Error('Aadhar number must be exactly 12 digits');
        }
        return true;
    },

    // Not empty validation
    validateNotEmpty(value, fieldName) {
        if (!value || value.trim() === '') {
            throw new Error(`${fieldName} cannot be empty`);
        }
        return true;
    },

    // Date validation (must be today or future)
    validateDate(dateStr) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const inputDate = new Date(dateStr);
        
        if (inputDate < today) {
            throw new Error('Date cannot be in the past');
        }
        return true;
    },

    // Positive number validation
    validatePositive(value, fieldName) {
        if (value <= 0) {
            throw new Error(`${fieldName} must be greater than 0`);
        }
        return true;
    }
};

// User Management
const UserManager = {
    // Register new user
    register(userData) {
        const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
        
        // Check if email already exists
        if (users.some(u => u.email === userData.email)) {
            throw new Error('Email already registered');
        }

        // Generate customer ID
        const customerId = 'CUST' + Math.floor(10000 + Math.random() * 90000);
        
        const newUser = {
            customerId,
            ...userData,
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
        return newUser;
    },

    // Login user
    login(email, password) {
        const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        
        if (!user) {
            throw new Error('Invalid email or password');
        }

        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
        return user;
    },

    // Admin login
    adminLogin(email, password) {
        const admins = JSON.parse(localStorage.getItem(STORAGE_KEYS.ADMINS) || '[]');
        const admin = admins.find(a => a.email === email && a.password === password);
        
        if (!admin) {
            throw new Error('Invalid admin credentials');
        }

        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify({ ...admin, isAdmin: true }));
        return admin;
    },

    // Get current user
    getCurrentUser() {
        const userStr = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
        return userStr ? JSON.parse(userStr) : null;
    },

    // Logout
    logout() {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    },

    // Update user profile
    updateProfile(customerId, updates) {
        const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
        const index = users.findIndex(u => u.customerId === customerId);
        
        if (index === -1) {
            throw new Error('User not found');
        }

        users[index] = { ...users[index], ...updates };
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
        
        // Update current user if it's the same user
        const currentUser = this.getCurrentUser();
        if (currentUser && currentUser.customerId === customerId) {
            localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(users[index]));
        }

        return users[index];
    }
};

// Train Management
const TrainManager = {
    // Get all trains
    getAllTrains() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.TRAINS) || '[]');
    },

    // Search trains
    searchTrains(origin, destination) {
        const trains = this.getAllTrains();
        return trains.filter(t => 
            t.origin.toLowerCase().includes(origin.toLowerCase()) &&
            t.destination.toLowerCase().includes(destination.toLowerCase())
        );
    },

    // Get train by number
    getTrainByNumber(trainNumber) {
        const trains = this.getAllTrains();
        return trains.find(t => t.trainNumber === trainNumber);
    },

    // Add new train (Admin)
    addTrain(trainData) {
        const trains = this.getAllTrains();
        
        if (trains.some(t => t.trainNumber === trainData.trainNumber)) {
            throw new Error('Train number already exists');
        }

        trains.push(trainData);
        localStorage.setItem(STORAGE_KEYS.TRAINS, JSON.stringify(trains));
        return trainData;
    },

    // Update train
    updateTrain(trainNumber, updates) {
        const trains = this.getAllTrains();
        const index = trains.findIndex(t => t.trainNumber === trainNumber);
        
        if (index === -1) {
            throw new Error('Train not found');
        }

        trains[index] = { ...trains[index], ...updates };
        localStorage.setItem(STORAGE_KEYS.TRAINS, JSON.stringify(trains));
        return trains[index];
    },

    // Update available seats
    updateSeats(trainNumber, seats) {
        const trains = this.getAllTrains();
        const index = trains.findIndex(t => t.trainNumber === trainNumber);
        
        if (index !== -1) {
            trains[index].availableSeats = seats;
            localStorage.setItem(STORAGE_KEYS.TRAINS, JSON.stringify(trains));
        }
    }
};

// Booking Management
const BookingManager = {
    // Create booking
    createBooking(bookingData) {
        const bookings = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]');
        
        const bookingId = 'BKG' + Date.now() + Math.floor(Math.random() * 1000);
        
        const newBooking = {
            bookingId,
            ...bookingData,
            bookingDate: new Date().toISOString(),
            status: 'Confirmed'
        };

        bookings.push(newBooking);
        localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));

        // Update train seats
        const train = TrainManager.getTrainByNumber(bookingData.trainNumber);
        if (train) {
            TrainManager.updateSeats(bookingData.trainNumber, 
                train.availableSeats - bookingData.numberOfTickets);
        }

        return newBooking;
    },

    // Get bookings by customer
    getCustomerBookings(customerId) {
        const bookings = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]');
        return bookings.filter(b => b.customerId === customerId);
    },

    // Get all bookings (Admin)
    getAllBookings() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]');
    },

    // Cancel booking
    cancelBooking(bookingId) {
        const bookings = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]');
        const index = bookings.findIndex(b => b.bookingId === bookingId);
        
        if (index === -1) {
            throw new Error('Booking not found');
        }

        const booking = bookings[index];
        
        // Calculate refund
        const bookingDate = new Date(booking.bookingDate);
        const journeyDate = new Date(booking.journeyDate);
        const now = new Date();
        
        const hoursSinceBooking = (now - bookingDate) / (1000 * 60 * 60);
        const hoursToJourney = (journeyDate - now) / (1000 * 60 * 60);
        
        let refundPercentage;
        if (hoursSinceBooking <= 48) {
            refundPercentage = 100;
        } else if (hoursToJourney >= 24) {
            refundPercentage = 70;
        } else {
            refundPercentage = 40;
        }

        const refundAmount = (booking.totalPrice * refundPercentage) / 100;

        bookings[index].status = 'Cancelled';
        bookings[index].refundAmount = refundAmount;
        bookings[index].cancellationDate = new Date().toISOString();

        localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));

        // Restore train seats
        const train = TrainManager.getTrainByNumber(booking.trainNumber);
        if (train) {
            TrainManager.updateSeats(booking.trainNumber, 
                train.availableSeats + booking.numberOfTickets);
        }

        return { ...bookings[index], refundPercentage };
    },

    // Get statistics
    getStatistics() {
        const bookings = this.getAllBookings();
        const confirmedBookings = bookings.filter(b => b.status === 'Confirmed');
        
        const totalRevenue = confirmedBookings.reduce((sum, b) => sum + b.totalPrice, 0);
        const ticketsByClass = {};
        
        confirmedBookings.forEach(b => {
            ticketsByClass[b.ticketCategory] = 
                (ticketsByClass[b.ticketCategory] || 0) + b.numberOfTickets;
        });

        return {
            totalBookings: confirmedBookings.length,
            totalRevenue,
            ticketsByClass
        };
    }
};

// Utility Functions
function showAlert(message, type = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    const container = document.querySelector('.container');
    if (container) {
        container.insertBefore(alertDiv, container.firstChild);
        setTimeout(() => alertDiv.remove(), 5000);
    }
}

function showError(inputElement, message) {
    inputElement.classList.add('error');
    const errorDiv = inputElement.nextElementSibling;
    if (errorDiv && errorDiv.classList.contains('error-message')) {
        errorDiv.textContent = message;
        errorDiv.classList.add('show');
    }
}

function clearError(inputElement) {
    inputElement.classList.remove('error');
    const errorDiv = inputElement.nextElementSibling;
    if (errorDiv && errorDiv.classList.contains('error-message')) {
        errorDiv.classList.remove('show');
    }
}

function formatCurrency(amount) {
    return '₹' + amount.toLocaleString('en-IN', { minimumFractionDigits: 2 });
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeDefaultData();
});
