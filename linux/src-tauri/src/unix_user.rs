// Who we are, for the relay socket name.

extern "C" {
    fn getuid() -> u32;
}

/// The UID of the account this process runs as, as a decimal string.
pub fn current_user_uid() -> String {
    // SAFETY: getuid() is always safe — it never fails and has no side effects.
    let uid = unsafe { getuid() };
    uid.to_string()
}
