import { db_client, PICKERS } from './db_init.js'

let currentUser = null;

export function getCurrentUser() {
    return currentUser;
}

export function setCurrentUser(user) {
    currentUser = user;
}

/* LOGIN */
export async function handleLogin(usernameInput, passwordInput) {
  const userIn = usernameInput.value;
  const passIn = passwordInput.value;

  const { data, error } = await db_client.auth.signInWithPassword({
    email: userIn,
    password: passIn,
  });

  if (error) {
    alert("Invalid Credentials. Please try again.");
    console.error("Error:", error);
    passwordInput.value = "";
    return;
  }
  // TODO: add in-app error message

  setCurrentUser(data?.user?.user_metadata);

  usernameInput.value = "";
  passwordInput.value = "";
}

export function authedUserDisplay(loginBtn, unauthedPicksContainer, menuContainer, userDisplay, userAvatar, deleteCommentBtns) {
  loginBtn.style.display = "none";
  unauthedPicksContainer.style.display = "flex";

  const color = PICKERS.find(p => p.uuid === getCurrentUser().sub)?.color;
  if (color) {
    menuContainer.style.setProperty('--user-theme', color);
    userDisplay.textContent = getCurrentUser().username;
    userAvatar.textContent = getCurrentUser().username.slice(0,2).toUpperCase();
  }  
  menuContainer.style.display = "block";

  // TODO: only if admin
  if (getCurrentUser().username === "fearthebeak") {
    deleteCommentBtns.forEach((btn) => {
      btn.style.display = "flex";
    });
  }
}

/* LOGOUT */
export async function handleLogout(menuContainer, loginBtn, userDropdownMenu) {
  const { error } = await db_client.auth.signOut();

  if (error) {
    console.error("Error signing out:", error.message);
  } else {
    menuContainer.style.display = "none";
    loginBtn.style.display = "flex";
    userDropdownMenu.classList.remove("active");
    setCurrentUser(null);
  }
}

/* FORGOT PASSWORD */
export async function forgotPassword(email) {
  const { error } = await db_client.auth.resetPasswordForEmail(email, {
    redirectTo: 'https://archstepboyz.github.io/archstepboyz/reset.html', 
  });

  if (error) {
    console.error('Error sending password reset email:', error.message);
    alert('Failed to send reset email. Please confirm your email address or try again later.');
  } else {
    alert('Password reset email sent. Check your inbox!');
  }
}

/* SIGN UP */
function showSignupError(errorBox, errorInput, message) {
  errorBox.innerText = message;
  errorBox.style.display = "block";

  // Re-trigger animation if it's already visible
  errorBox.style.animation = "none";
  errorBox.offsetHeight; /* trigger reflow */
  errorBox.style.animation = null;

  errorInput.classList.add("input-invalid");
}

function clearSignupError(errorBox, errorInput, message) {
  errorInput.classList.remove("input-invalid");

  if (!message || errorBox.innerText.includes(message)) {
    const errorBox = document.getElementById("signup-error-msg");
    errorBox.style.display = "none";
    errorBox.innerText = "";
  }
}

export function validateInputs(errorBox, newReferral, newPassword) {
  const code = newReferral.value.trim();
  if (code.length > 0 && code.length < 6) {
    showSignupError(errorBox, newReferral, "Referral code must be at least 6 characters.");
    return false;
  }
  clearSignupError(errorBox, newReferral, "Referral");

  const pass = newPassword.value.trim();
  if (pass.length > 0 && pass.length < 8) {
    showSignupError(errorBox, newPassword, "Password must be at least 8 characters.");
    return false;
  }
  clearSignupError(errorBox, newPassword, "Password");

  return true;
}

async function signUpWithReferral(email, password, username, referralCode, errorBox, newReferral) {
  const { data: validCode, codeError } = await db_client.rpc(
    "check_referral_code",
    { input_code: referralCode },
  );

  if (!validCode) {
    showSignupError(
      errorBox,
      newReferral,
      "Invalid referral code. Please contact a founding ArchStepBoyz member.",
    );
    return false;
  }

  const { data, error } = await db_client.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        username: username,
        referral_code: referralCode,
      },
      emailRedirectTo: "https://archstepboyz.github.io/archstepboyz",
    },
  });

  if (error) {
    return false;
  } else {
    return true;
  }
}

export async function handleSignup(newUsername, newEmail, newPassword, newReferral, errorBox, signupSubmitBtn, signupContent, successContent, authBox) {

  const newUsernameVal = newUsername.value;
  const newEmailVal = newEmail.value;
  const newPasswordVal = newPassword.value;
  const referralCode = newReferral.value;

  if (!validateInputs(errorBox, newReferral, newPassword)) {
    return;
  }

  const accountCreated = await signUpWithReferral(
    newEmailVal,
    newPasswordVal,
    newUsernameVal,
    referralCode,
    errorBox,
    newReferral,
  );

  if (accountCreated) {
    const originalText = signupSubmitBtn.innerText;
    signupSubmitBtn.innerText = "Creating...";

    setTimeout(() => {
      signupContent.style.display = "none";
      successContent.style.display = "flex";
      authBox.style.height = "420px";

      signupSubmitBtn.innerText = originalText;
      newEmail.value = "";
      newUsername.value = "";
      newPassword.value = "";
      newReferral.value = "";
    }, 1000); 
  }
}

/* FORM LAYOUT */
export function toggleAuthMode(mode, loginView, signupView, forgotView, modalBox) {
    loginView.style.display = 'none';
    signupView.style.display = 'none';
    forgotView.style.display = 'none';
    modalBox.classList.remove('mode-login', 'mode-signup', 'mode-forgot');

    if (mode === 'signup') {
      signupView.style.display = 'block';
      modalBox.classList.add('mode-signup');
    } else if (mode === 'forgot') {
      forgotView.style.display = 'block';
      modalBox.classList.add('mode-forgot');
    } else {
      // Default to login
      loginView.style.display = 'block';
      modalBox.classList.add('mode-login');
    }
}
