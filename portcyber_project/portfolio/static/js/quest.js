// ========================================
// QUEST SYSTEM LOGIC
// ========================================

window.addEventListener('load', () => {
    const questPanel = document.getElementById('quest-panel');
    const trophyRewardBtn = document.getElementById('claim-trophy-reward');
    const coinRewardBtn = document.getElementById('claim-coin-reward');
    const questCompleted = localStorage.getItem('questCompleted');

    if (!questPanel || !trophyRewardBtn || !coinRewardBtn) {
        console.error('[QUEST] Quest panel or reward buttons not found.');
        // Still fetch stats even if quest panel is missing, as it's for general header stats
        fetchSiteStats();
        setInterval(fetchSiteStats, 5000); // Poll every 5 seconds
        return;
    }

    if (!questCompleted) {
        questPanel.style.display = 'block';
    } else {
        questPanel.style.display = 'none';
    }

    trophyRewardBtn.addEventListener('click', () => claimQuestReward('trophy'));
    coinRewardBtn.addEventListener('click', () => claimQuestReward('coin'));
    
    // Initial fetch of stats and then periodic updates
    fetchSiteStats();
    setInterval(fetchSiteStats, 5000); // Poll every 5 seconds
});

function fetchSiteStats() {
    fetch('/api/site-stats/')
        .then(response => response.json())
        .then(data => {
            if (data.level !== undefined && data.trophies !== undefined && data.coins !== undefined) {
                updateStatsUI(data.level, data.trophies, data.coins);
            } else {
                console.error('[QUEST] Invalid data received from /api/site-stats/:', data);
            }
        })
        .catch(error => console.error('[QUEST] Error fetching site stats:', error));
}

function claimQuestReward(rewardType) {
    const csrftoken = getCookie('csrftoken');

    fetch('/api/claim-reward/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        },
        body: JSON.stringify({ reward_type: rewardType })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            updateStatsUI(data.level, data.trophies, data.coins);
            document.getElementById('quest-panel').style.display = 'none';
            localStorage.setItem('questCompleted', 'true');
            if (window.systemFeedback) {
                window.systemFeedback.message('REWARD_CLAIMED', 'success');
            }
        } else {
            console.error('[QUEST] Error claiming reward:', data.message);
            if (window.systemFeedback) {
                window.systemFeedback.message('REWARD_CLAIM_ERROR', 'error');
            }
        }
    })
    .catch(error => {
        console.error('[QUEST] Fetch error:', error);
        if (window.systemFeedback) {
            window.systemFeedback.message('CONNECTION_ERROR', 'error');
        }
    });
}

function updateStatsUI(level, trophies, coins) {
    const levelDisplay = document.getElementById('level-display');
    const trophyDisplay = document.getElementById('trophy-display');
    const coinsDisplay = document.getElementById('coins-display');

    if (levelDisplay) levelDisplay.textContent = level;
    if (trophyDisplay) trophyDisplay.textContent = trophies;
    if (coinsDisplay) coinsDisplay.textContent = coins.toLocaleString();
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
