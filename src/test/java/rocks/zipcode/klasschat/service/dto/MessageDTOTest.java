package rocks.zipcode.klasschat.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import rocks.zipcode.klasschat.web.rest.TestUtil;

class MessageDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(MessageDTO.class);
        MessageDTO messageDTO1 = new MessageDTO();
        messageDTO1.setId(1L);
        MessageDTO messageDTO2 = new MessageDTO();
        assertThat(messageDTO1).isNotEqualTo(messageDTO2);
        messageDTO2.setId(messageDTO1.getId());
        assertThat(messageDTO1).isEqualTo(messageDTO2);
        messageDTO2.setId(2L);
        assertThat(messageDTO1).isNotEqualTo(messageDTO2);
        messageDTO1.setId(null);
        assertThat(messageDTO1).isNotEqualTo(messageDTO2);
    }
}
