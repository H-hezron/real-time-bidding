export async function createUser(user) {
  return window.canister.advertManager.addUser(user);
}

export async function updateUser(user) {
  return window.canister.advertManager.updateUser(user);
}

export async function followUser(userId) {
  return window.canister.advertManager.followUser(userId);
}

export async function getUserByOwner() {
  try {
    return await window.canister.advertManager.getUserByOwner();
  } catch (err) {
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }
}

export async function getUsers() {
  try {
    return await window.canister.advertManager.getUsers();
  } catch (err) {
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }
}
