# Copyright 2024 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
# pylint: disable=W0201, E0611

import os
from typing import Any
import uuid

from utils.chat_utils import save_chat
from utils.multimodal_utils import (
    HELP_GCS_CHECKBOX,
    HELP_MESSAGE_MULTIMODALITY,
    upload_files_to_gcs,
)

EMPTY_CHAT_NAME = "Empty chat"
NUM_CHAT_IN_RECENT = 3
DEFAULT_BASE_URL = "http://localhost:8000/"


class SideBar:
    """Manages the sidebar components of the Streamlit application."""

    def __init__(self, st: Any) -> None:
        """
        Initialize the SideBar.

        Args:
            st (Any): The Streamlit object for rendering UI components.
        """
        self.st = st
        self.uploaded_files = None
        self.uploaded_folder = None
        if "bucket_name" not in self.st.session_state:
            self.st.session_state["bucket_name"] = os.environ.get("BUCKET_NAME", "gs://your-bucket-name")

    def init_side_bar(self) -> None:
        """Initialize and render the sidebar components."""
        with self.st.sidebar:
            self.url_input_field = self.st.text_input(
                label="Local URL",
                value=os.environ.get("SERVICE_URL", DEFAULT_BASE_URL),
            )
            self.should_authenticate_request = self.st.checkbox(
                label="Authenticate request",
                value=False,
                help="If checked, any request to the server will contain an Identity token to allow authentication. "
                     "See the Cloud Run documentation to know more about authentication: "
                     "https://cloud.google.com/run/docs/authenticating/service-to-service",
            )
            col1, col2, col3 = self.st.columns(3)
            with col1:
                if self.st.button("+ New chat"):
                    if (
                        len(
                            self.st.session_state.user_chats[
                                self.st.session_state["session_id"]
                            ]["messages"]
                        )
                        > 0
                    ):
                        self.st.session_state.run_id = None

                        self.st.session_state["session_id"] = str(uuid.uuid4())
                        self.st.session_state.session_db.get_session(
                            session_id=self.st.session_state["session_id"],
                        )
                        self.st.session_state.user_chats[
                            self.st.session_state["session_id"]
                        ] = {
                            "title": EMPTY_CHAT_NAME,
                            "messages": [],
                        }

            with col2:
                if self.st.button("Delete chat"):
                    self.st.session_state.run_id = None
                    self.st.session_state.session_db.clear()
                    self.st.session_state.user_chats.pop(
                        self.st.session_state["session_id"]
                    )
                    if len(self.st.session_state.user_chats) > 0:
                        chat_id = list(self.st.session_state.user_chats.keys())[0]
                        self.st.session_state["session_id"] = chat_id
                        self.st.session_state.session_db.get_session(
                            session_id=self.st.session_state["session_id"],
                        )
                    else:
                        self.st.session_state["session_id"] = str(uuid.uuid4())
                        self.st.session_state.user_chats[
                            self.st.session_state["session_id"]
                        ] = {
                            "title": EMPTY_CHAT_NAME,
                            "messages": [],
                        }
            with col3:
                if self.st.button("Save chat"):
                    save_chat(self.st)

            self.st.subheader("Recent")  # Style the heading

            all_chats = list(reversed(self.st.session_state.user_chats.items()))
            for chat_id, chat in all_chats[:NUM_CHAT_IN_RECENT]:
                if self.st.button(chat["title"], key=chat_id):
                    self.st.session_state.run_id = None
                    self.st.session_state["session_id"] = chat_id
                    self.st.session_state.session_db.get_session(
                        session_id=self.st.session_state["session_id"],
                    )

            with self.st.expander("Other chats"):
                for chat_id, chat in all_chats[NUM_CHAT_IN_RECENT:]:
                    if self.st.button(chat["title"], key=chat_id):
                        self.st.session_state.run_id = None
                        self.st.session_state["session_id"] = chat_id
                        self.st.session_state.session_db.get_session(
                            session_id=self.st.session_state["session_id"],
                        )

            self.st.divider()

            self.st.header("Upload files from local")
            # Retrieve previously stored bucket name if available
            stored_bucket_name = self.st.session_state.get(
                "bucket_name", os.environ.get("BUCKET_NAME", "gs://your-bucket-name")
            )

            bucket_name = self.st.text_input(
                label="GCS Bucket for upload",
                value=stored_bucket_name,
                key="bucket_name_input",
            )

            # Save the bucket_name to session_state if changed
            if bucket_name != stored_bucket_name:
                self.st.session_state["bucket_name"] = bucket_name

            if "checkbox_state" not in self.st.session_state:
                self.st.session_state.checkbox_state = True

            self.st.session_state.checkbox_state = self.st.checkbox(
                "Upload to GCS first (suggested)", value=False, help=HELP_GCS_CHECKBOX
            )

            # Add folder upload toggle
            use_folder_upload = self.st.checkbox(
                "Upload Entire Folder",
                value=False,
                help="Upload multiple files from a .zip file"
            )

            if use_folder_upload:
                self.uploaded_files = None  # Reset files when in folder mode
                self.uploaded_folder = self.st.file_uploader(
                    "Upload a .zip file containing your documents",
                    type=["zip"],
                    key=f"folder_uploader_{self.st.session_state.uploader_key}"
                )
                if self.uploaded_folder:
                    self.st.info(f"Processing {self.uploaded_folder.name}...")
            else:
                self.uploaded_folder = None  # Reset folder when in files mode
                self.uploaded_files = self.st.file_uploader(
                    label="Send files from local",
                    accept_multiple_files=True,
                    key=f"uploader_images_{self.st.session_state.uploader_key}",
                    type=[
                        "png", "jpg", "jpeg", "txt", "docx", "pdf",
                        "rtf", "csv", "tsv", "xlsx", "md", "markdown"
                    ],
                )

            if (self.uploaded_files or self.uploaded_folder) and self.st.session_state.checkbox_state:
                upload_files_to_gcs(
                    self.st,
                    bucket_name,
                    self.uploaded_files if self.uploaded_files else [self.uploaded_folder],
                    is_folder=bool(self.uploaded_folder)
                )

            self.st.divider()

            self.st.header("Upload files from GCS")
            self.gcs_uris = self.st.text_area(
                "GCS uris (comma-separated)",
                value=self.st.session_state["gcs_uris_to_be_sent"],
                key=f"upload_text_area_{self.st.session_state.uploader_key}",
                help=HELP_MESSAGE_MULTIMODALITY,
            )

            self.st.caption(f"Note: {HELP_MESSAGE_MULTIMODALITY}")
