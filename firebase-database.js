// Firebase Database Operations voor Epstein United - Firebase v12

class DatabaseManager {
    constructor() {
        this.db = window.firebaseDB;
        this.registrationsCollection = 'registrations';
        this.statisticsCollection = 'statistics';
    }

    // Nieuwe registratie toevoegen
    async addRegistration(registrationData) {
        try {
            import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";
            
            const docRef = await addDoc(collection(this.db, this.registrationsCollection), {
                ...registrationData,
                timestamp: serverTimestamp(),
                createdAt: new Date().toISOString(),
                status: 'active'
            });
            
            // Update statistieken
            await this.updateStatistics();
            
            return {
                success: true,
                id: docRef.id,
                message: 'Aanmelding succesvol opgeslagen!'
            };
        } catch (error) {
            console.error('Error adding registration:', error);
            return {
                success: false,
                error: error.message,
                message: 'Er is een fout opgetreden bij het opslaan van de aanmelding.'
            };
        }
    }

    // Alle registraties ophalen
    async getAllRegistrations() {
        try {
            import { collection, getDocs, orderBy, query } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";
            
            const q = query(collection(this.db, this.registrationsCollection), orderBy('timestamp', 'desc'));
            const snapshot = await getDocs(q);
            
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error getting registrations:', error);
            return [];
        }
    }

    // Recente registraties ophalen (laatste 10)
    async getRecentRegistrations(limit = 10) {
        try {
            import { collection, getDocs, orderBy, query, limit as limitFn } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";
            
            const q = query(
                collection(this.db, this.registrationsCollection), 
                orderBy('timestamp', 'desc'),
                limitFn(limit)
            );
            const snapshot = await getDocs(q);
            
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error getting recent registrations:', error);
            return [];
        }
    }

    // Real-time listener voor registraties
    onRegistrationsUpdate(callback) {
        import { collection, orderBy, query, onSnapshot } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";
        
        const q = query(
            collection(this.db, this.registrationsCollection), 
            orderBy('timestamp', 'desc')
        );
        
        return onSnapshot(q, (snapshot) => {
            const registrations = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            callback(registrations);
        }, (error) => {
            console.error('Real-time listener error:', error);
        });
    }

    // Statistieken ophalen
    async getStatistics() {
        try {
            import { doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";
            
            const docRef = doc(this.db, this.statisticsCollection, 'current');
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                return docSnap.data();
            } else {
                // Initieel statistieken document aanmaken
                const initialStats = {
                    totalMembers: 247,
                    activeParticipants: 189,
                    newMembers: 23,
                    lastUpdated: serverTimestamp()
                };
                await setDoc(docRef, initialStats);
                return initialStats;
            }
        } catch (error) {
            console.error('Error getting statistics:', error);
            return {
                totalMembers: 247,
                activeParticipants: 189,
                newMembers: 23
            };
        }
    }

    // Statistieken bijwerken
    async updateStatistics() {
        try {
            import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";
            
            const registrations = await this.getAllRegistrations();
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            
            const newMembers = registrations.filter(reg => {
                if (!reg.timestamp) return false;
                const timestamp = reg.timestamp.toDate ? reg.timestamp.toDate() : new Date(reg.timestamp);
                return timestamp > thirtyDaysAgo;
            }).length;
            
            const stats = {
                totalMembers: 247 + registrations.length,
                activeParticipants: 189 + Math.floor(registrations.length * 0.8),
                newMembers: 23 + newMembers,
                lastUpdated: serverTimestamp()
            };
            
            await setDoc(doc(this.db, this.statisticsCollection, 'current'), stats);
            return stats;
        } catch (error) {
            console.error('Error updating statistics:', error);
            return null;
        }
    }

    // Real-time listener voor statistieken
    onStatisticsUpdate(callback) {
        import { doc, onSnapshot } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";
        
        const docRef = doc(this.db, this.statisticsCollection, 'current');
        return onSnapshot(docRef, (doc) => {
            if (doc.exists()) {
                callback(doc.data());
            }
        });
    }

    // Registratie verwijderen (admin functie)
    async deleteRegistration(registrationId) {
        try {
            import { doc, deleteDoc } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";
            
            await deleteDoc(doc(this.db, this.registrationsCollection, registrationId));
            await this.updateStatistics();
            return { success: true, message: 'Registratie verwijderd' };
        } catch (error) {
            console.error('Error deleting registration:', error);
            return { success: false, error: error.message };
        }
    }

    // Registratie bijwerken
    async updateRegistration(registrationId, updateData) {
        try {
            import { doc, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";
            
            await updateDoc(doc(this.db, this.registrationsCollection, registrationId), {
                ...updateData,
                lastModified: serverTimestamp()
            });
            return { success: true, message: 'Registratie bijgewerkt' };
        } catch (error) {
            console.error('Error updating registration:', error);
            return { success: false, error: error.message };
        }
    }

    // Zoeken in registraties
    async searchRegistrations(searchTerm) {
        try {
            import { collection, getDocs } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";
            
            const snapshot = await getDocs(collection(this.db, this.registrationsCollection));
            
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })).filter(reg => 
                reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                reg.activity.toLowerCase().includes(searchTerm.toLowerCase())
            );
        } catch (error) {
            console.error('Error searching registrations:', error);
            return [];
        }
    }
}

// Globale database manager instantie
window.dbManager = new DatabaseManager();
